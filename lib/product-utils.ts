import { Decimal } from "@prisma/client/runtime/library";

export interface VariantPriceData {
	price: Decimal | number;
	salePrice?: Decimal | number | null;
	saleStartDate?: Date | null;
	saleEndDate?: Date | null;
}

/**
 * Convert Decimal or number to number
 */
export function toNumber(value: Decimal | number | null | undefined): number {
	if (value === null || value === undefined) return 0;
	if (typeof value === "number") return value;
	return Number(value);
}

/**
 * Check if a variant is currently on sale (within valid date range)
 */
export function isVariantOnSale(variant: VariantPriceData): boolean {
	if (!variant.salePrice) return false;

	const now = new Date();
	const salePrice = toNumber(variant.salePrice);

	if (salePrice <= 0) return false;

	// Check start date
	if (variant.saleStartDate && now < variant.saleStartDate) {
		return false;
	}

	// Check end date
	if (variant.saleEndDate && now > variant.saleEndDate) {
		return false;
	}

	return true;
}

/**
 * Get the display price for a variant (sale price if on sale, otherwise regular price)
 */
export function getDisplayPrice(variant: VariantPriceData): number {
	if (isVariantOnSale(variant)) {
		return toNumber(variant.salePrice);
	}
	return toNumber(variant.price);
}

/**
 * Get the original price for a variant
 */
export function getOriginalPrice(variant: VariantPriceData): number {
	return toNumber(variant.price);
}

/**
 * Calculate the discount percentage for a variant
 */
export function getDiscountPercent(variant: VariantPriceData): number {
	if (!isVariantOnSale(variant)) return 0;

	const originalPrice = toNumber(variant.price);
	const salePrice = toNumber(variant.salePrice);

	if (originalPrice <= 0) return 0;

	return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
}

/**
 * Format price for display (USD format)
 */
export function formatPrice(price: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
}

/**
 * Get stock status label and styling
 */
export function getStockStatus(stock: number): {
	label: string;
	isInStock: boolean;
} {
	return {
		label: stock > 0 ? "IN STOCK" : "OUT OF STOCK",
		isInStock: stock > 0,
	};
}
