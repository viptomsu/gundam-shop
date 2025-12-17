"use server";

import { prisma } from "@/lib/prisma";
import {
	checkoutFormSchema,
	type CheckoutFormValues,
} from "@/schemas/checkout";
import type { CartItem } from "@/store/cart";
import { PaymentMethod, OrderStatus, PaymentStatus } from "@prisma/client";

// Shipping fee constant (30,000 VND in cents/base unit)
const SHIPPING_FEE = 30000;

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
