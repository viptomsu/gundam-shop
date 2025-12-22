import type { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

/**
 * Order status display config for storefront (with Tailwind classes)
 */
export const orderStatusConfig: Record<
	OrderStatus,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
		className: string;
	}
> = {
	PENDING: {
		label: "Pending",
		variant: "outline",
		className: "border-yellow-500/50 text-yellow-500 bg-yellow-500/10",
	},
	CONFIRMED: {
		label: "Confirmed",
		variant: "outline",
		className: "border-blue-500/50 text-blue-500 bg-blue-500/10",
	},
	SHIPPING: {
		label: "Shipping",
		variant: "outline",
		className: "border-purple-500/50 text-purple-500 bg-purple-500/10",
	},
	DELIVERED: {
		label: "Delivered",
		variant: "outline",
		className: "border-green-500/50 text-green-500 bg-green-500/10",
	},
	CANCELLED: {
		label: "Cancelled",
		variant: "destructive",
		className: "border-destructive/50 text-destructive bg-destructive/10",
	},
};

/**
 * Order status config for admin (with Badge color props)
 */
export const adminOrderStatusConfig: Record<
	OrderStatus,
	{ label: string; color: "warning" | "default" | "success" | "destructive" }
> = {
	PENDING: { label: "Pending", color: "warning" },
	CONFIRMED: { label: "Confirmed", color: "default" },
	SHIPPING: { label: "Shipping", color: "default" },
	DELIVERED: { label: "Delivered", color: "success" },
	CANCELLED: { label: "Cancelled", color: "destructive" },
};

/**
 * Payment status config
 */
export const paymentStatusConfig: Record<
	PaymentStatus,
	{
		label: string;
		color: "success" | "default" | "destructive";
		className: string;
	}
> = {
	PENDING: { label: "Pending", color: "default", className: "text-yellow-500" },
	PAID: { label: "Paid", color: "success", className: "text-green-500" },
	FAILED: {
		label: "Failed",
		color: "destructive",
		className: "text-destructive",
	},
};

/**
 * Payment method labels
 */
export const paymentMethodLabels: Record<PaymentMethod, string> = {
	COD: "Cash on Delivery",
	BANK_TRANSFER: "Bank Transfer",
	VNPAY: "VNPay",
};

/**
 * Format currency for VND
 * Handles Prisma Decimal type and number/string inputs
 */
export function formatVNCurrency(amount: unknown): string {
	const num =
		typeof amount === "object" && amount !== null
			? parseFloat(String(amount))
			: typeof amount === "string"
			? parseFloat(amount)
			: Number(amount);
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(num);
}
