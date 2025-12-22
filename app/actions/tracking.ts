"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema
const trackOrderSchema = z.object({
	orderNumber: z.string().min(1, "Order number is required"),
	email: z.string().email("Valid email is required"),
});

export type TrackOrderInput = z.infer<typeof trackOrderSchema>;

// Public order data (no sensitive info)
export interface TrackedOrder {
	orderNumber: string;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	guestName: string;
	shippingAddress: string;
	trackingNumber: string | null;
	carrier: string | null;
	paymentMethod: string;
	paymentStatus: string;
	subtotal: number;
	shippingFee: number;
	discountAmount: number;
	totalAmount: number;
	orderItems: {
		id: string;
		quantity: number;
		price: number;
		originalPrice: number;
		variant: {
			name: string;
			image: string | null;
			product: {
				name: string;
				slug: string;
				images: string[];
			};
		};
	}[];
}

export interface TrackOrderResult {
	success: boolean;
	order?: TrackedOrder;
	error?: string;
}

/**
 * Server Action: Track Order by Order Number and Email
 *
 * Security: Requires BOTH order number AND matching email to prevent
 * unauthorized order lookups.
 */
export async function trackOrder(
	input: TrackOrderInput
): Promise<TrackOrderResult> {
	try {
		// Validate input
		const validated = trackOrderSchema.safeParse(input);
		if (!validated.success) {
			return {
				success: false,
				error: validated.error.issues[0]?.message || "Invalid input",
			};
		}

		const { orderNumber, email } = validated.data;
		const normalizedEmail = email.toLowerCase().trim();

		// Find order with email verification
		// Match guestEmail OR user.email
		const order = await prisma.order.findFirst({
			where: {
				orderNumber: orderNumber,
				OR: [
					{ guestEmail: { equals: normalizedEmail, mode: "insensitive" } },
					{ user: { email: { equals: normalizedEmail, mode: "insensitive" } } },
				],
			},
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

		if (!order) {
			return {
				success: false,
				error: "Order not found or email does not match.",
			};
		}

		// Return public order data only (no sensitive IDs)
		const trackedOrder: TrackedOrder = {
			orderNumber: order.orderNumber,
			status: order.status,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
			guestName: order.guestName,
			shippingAddress: order.shippingAddress,
			trackingNumber: order.trackingNumber,
			carrier: order.carrier,
			paymentMethod: order.paymentMethod,
			paymentStatus: order.paymentStatus,
			subtotal: Number(order.subtotal),
			shippingFee: Number(order.shippingFee),
			discountAmount: Number(order.discountAmount),
			totalAmount: Number(order.totalAmount),
			orderItems: order.orderItems.map((item) => ({
				id: item.id,
				quantity: item.quantity,
				price: Number(item.price),
				originalPrice: Number(item.originalPrice),
				variant: {
					name: item.variant.name,
					image: item.variant.image,
					product: {
						name: item.variant.product.name,
						slug: item.variant.product.slug,
						images: item.variant.product.images,
					},
				},
			})),
		};

		return {
			success: true,
			order: trackedOrder,
		};
	} catch (error) {
		console.error("[TRACK_ORDER_ERROR]", error);
		return {
			success: false,
			error: "An error occurred while tracking your order.",
		};
	}
}
