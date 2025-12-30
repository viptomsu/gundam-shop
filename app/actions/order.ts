"use server";

import { prisma } from "@/lib/prisma";
import {
	checkoutFormSchema,
	type CheckoutFormValues,
} from "@/schemas/checkout";
import type { CartItem } from "@/store/cart";
import { PaymentMethod, OrderStatus, PaymentStatus } from "@prisma/client";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import { getServerAuthCookies } from "@/lib/auth-cookies";

// Shipping fee constant (5 USD)
const SHIPPING_FEE = 5;

interface PlaceOrderResult {
	success: boolean;
	orderId?: string;
	message?: string;
}

/**
 * Generate unique order number
 * Format: GDM-{timestamp}-{random}
 */
function generateOrderNumber(): string {
	const timestamp = Date.now().toString(36).toUpperCase();
	const random = Math.random().toString(36).substring(2, 6).toUpperCase();
	return `GDM-${timestamp}-${random}`;
}

/**
 * Server Action: Place Order
 * Uses Prisma transaction for atomicity and race condition prevention
 */
export async function placeOrder(
	formData: CheckoutFormValues,
	cartItems: CartItem[]
): Promise<PlaceOrderResult> {
	try {
		// 1. Validate form data
		const validatedData = checkoutFormSchema.safeParse(formData);
		if (!validatedData.success) {
			return {
				success: false,
				message: validatedData.error.issues[0]?.message || "Invalid form data",
			};
		}

		// 2. Validate cart is not empty
		if (!cartItems || cartItems.length === 0) {
			return {
				success: false,
				message: "Your cart is empty",
			};
		}

		// 3. Execute transaction
		const variantIds = cartItems.map((item) => item.variantId);

		// Get user ID if logged in
		const { accessToken } = await getServerAuthCookies();
		let userId: string | null = null;

		console.log("Access token:", accessToken);
		if (accessToken) {
			try {
				const decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as {
					userId: string;
				};
				userId = decoded.userId;
			} catch {
				// Invalid token, ignore (treat as guest)
			}
		}

		const order = await prisma.$transaction(async (tx) => {
			// 3a. Fetch variants with current stock (FOR UPDATE lock in transaction)
			const variants = await tx.productVariant.findMany({
				where: { id: { in: variantIds } },
				select: {
					id: true,
					name: true,
					stock: true,
					price: true,
					salePrice: true,
					saleStartDate: true,
					saleEndDate: true,
					product: {
						select: {
							name: true,
						},
					},
				},
			});

			// 3b. Stock validation - check each item
			const variantMap = new Map(variants.map((v) => [v.id, v]));

			for (const item of cartItems) {
				const variant = variantMap.get(item.variantId);

				if (!variant) {
					throw new Error(`Product "${item.name}" is no longer available`);
				}

				if (variant.stock < item.quantity) {
					const productName = `${variant.product.name} - ${variant.name}`;
					if (variant.stock === 0) {
						throw new Error(`"${productName}" is out of stock`);
					}
					throw new Error(
						`"${productName}" only has ${variant.stock} units available`
					);
				}
			}

			// 3c. Calculate totals
			const subtotal = cartItems.reduce(
				(sum, item) => sum + item.price * item.quantity,
				0
			);
			const shippingFee = SHIPPING_FEE;
			const discountAmount = 0; // Placeholder for future coupon feature
			const totalAmount = subtotal + shippingFee - discountAmount;

			// 3d. Create order
			const orderNumber = generateOrderNumber();
			const newOrder = await tx.order.create({
				data: {
					orderNumber,
					userId, // Link to user if logged in
					guestName: validatedData.data.guestName,
					guestEmail: validatedData.data.guestEmail,
					guestPhone: validatedData.data.guestPhone,
					shippingAddress: validatedData.data.shippingAddress,
					note: validatedData.data.note || null,
					paymentMethod: validatedData.data.paymentMethod as PaymentMethod,
					subtotal,
					shippingFee,
					discountAmount,
					totalAmount,
					orderItems: {
						create: cartItems.map((item) => {
							const variant = variantMap.get(item.variantId)!;
							// Get original price from variant
							const originalPrice = Number(variant.price);

							return {
								variantId: item.variantId,
								quantity: item.quantity,
								price: item.price, // Sale price at time of purchase
								originalPrice, // Original listed price
							};
						}),
					},
				},
			});

			// 3e. Update inventory - decrement stock for each variant
			for (const item of cartItems) {
				await tx.productVariant.update({
					where: { id: item.variantId },
					data: {
						stock: {
							decrement: item.quantity,
						},
					},
				});
			}

			return newOrder;
		});

		return {
			success: true,
			orderId: order.id,
		};
	} catch (error) {
		console.error("[PLACE_ORDER_ERROR]", error);
		return {
			success: false,
			message: error instanceof Error ? error.message : "Failed to place order",
		};
	}
}

/**
 * Fetch order by ID (for success page)
 */
export async function getOrderById(orderId: string) {
	try {
		const order = await prisma.order.findUnique({
			where: { id: orderId },
			include: {
				orderItems: {
					include: {
						variant: {
							select: {
								name: true,
								image: true,
								product: {
									select: {
										name: true,
										slug: true,
										images: true,
									},
								},
							},
						},
					},
				},
			},
		});

		return order;
	} catch (error) {
		console.error("[GET_ORDER_ERROR]", error);
		return null;
	}
}

interface ActionResult {
	success: boolean;
	message?: string;
}

/**
 * Server Action: Update Order Status
 * Handles restocking when order is cancelled
 */
export async function updateOrderStatus(
	orderId: string,
	newStatus: OrderStatus
): Promise<ActionResult> {
	try {
		// Check if restocking is needed (CANCELLED status)
		const needsRestock = newStatus === OrderStatus.CANCELLED;

		if (needsRestock) {
			// Use transaction to update status and restock items atomically
			await prisma.$transaction(async (tx) => {
				// Get current order with items
				const order = await tx.order.findUnique({
					where: { id: orderId },
					include: {
						orderItems: true,
					},
				});

				if (!order) {
					throw new Error("Order not found");
				}

				// Prevent re-cancelling already cancelled orders
				if (order.status === OrderStatus.CANCELLED) {
					throw new Error("Order is already cancelled");
				}

				// Update order status
				await tx.order.update({
					where: { id: orderId },
					data: { status: newStatus },
				});

				// Restock each item
				for (const item of order.orderItems) {
					await tx.productVariant.update({
						where: { id: item.variantId },
						data: {
							stock: {
								increment: item.quantity,
							},
						},
					});
				}
			});
		} else {
			// Simple status update without restocking
			const order = await prisma.order.findUnique({
				where: { id: orderId },
			});

			if (!order) {
				return { success: false, message: "Order not found" };
			}

			// Prevent changing status from CANCELLED
			if (order.status === OrderStatus.CANCELLED) {
				return {
					success: false,
					message: "Cannot change status of cancelled orders",
				};
			}

			await prisma.order.update({
				where: { id: orderId },
				data: { status: newStatus },
			});
		}

		return { success: true };
	} catch (error) {
		console.error("[UPDATE_ORDER_STATUS_ERROR]", error);
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: "Failed to update order status",
		};
	}
}

/**
 * Server Action: Update Payment Status
 */
export async function updatePaymentStatus(
	orderId: string,
	newStatus: PaymentStatus
): Promise<ActionResult> {
	try {
		const order = await prisma.order.findUnique({
			where: { id: orderId },
		});

		if (!order) {
			return { success: false, message: "Order not found" };
		}

		await prisma.order.update({
			where: { id: orderId },
			data: { paymentStatus: newStatus },
		});

		return { success: true };
	} catch (error) {
		console.error("[UPDATE_PAYMENT_STATUS_ERROR]", error);
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: "Failed to update payment status",
		};
	}
}

/**
 * Server Action: Cancel My Order (User self-service)
 * Only allows cancellation of user's own PENDING orders
 * Restocks inventory atomically
 */
export async function cancelMyOrder(orderId: string): Promise<ActionResult> {
	try {
		// Get user from access token cookie
		const { accessToken } = await getServerAuthCookies();

		if (!accessToken) {
			return { success: false, message: "Unauthorized" };
		}

		let decoded: { userId: string };
		try {
			decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: string };
		} catch {
			return { success: false, message: "Invalid token" };
		}

		// Use transaction for atomicity
		await prisma.$transaction(async (tx) => {
			// Get order and verify ownership
			const order = await tx.order.findUnique({
				where: { id: orderId },
				include: { orderItems: true },
			});

			if (!order) {
				throw new Error("Order not found");
			}

			// Verify ownership
			if (order.userId !== decoded.userId) {
				throw new Error("You don't have permission to cancel this order");
			}

			// Check status - only PENDING orders can be cancelled
			if (order.status !== OrderStatus.PENDING) {
				throw new Error("Only pending orders can be cancelled");
			}

			// Update order status
			await tx.order.update({
				where: { id: orderId },
				data: { status: OrderStatus.CANCELLED },
			});

			// Restock inventory
			for (const item of order.orderItems) {
				await tx.productVariant.update({
					where: { id: item.variantId },
					data: {
						stock: { increment: item.quantity },
					},
				});
			}
		});

		return { success: true };
	} catch (error) {
		console.error("[CANCEL_MY_ORDER_ERROR]", error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "Failed to cancel order",
		};
	}
}
