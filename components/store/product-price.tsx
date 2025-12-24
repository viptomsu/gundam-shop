import { formatPrice } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

interface ProductPriceProps {
	price: number | string;
	originalPrice: number | string;
	isOnSale: boolean;
	className?: string; // Container class
	size?: "sm" | "default" | "lg";
}

export function ProductPrice({
	price,
	originalPrice,
	isOnSale,
	className,
	size = "default",
}: ProductPriceProps) {
	const textSize =
		size === "lg"
			? "text-3xl lg:text-4xl"
			: size === "sm"
			? "text-xl lg:text-2xl"
			: "text-2xl lg:text-3xl";

	return (
		<div className={cn("flex items-baseline gap-3", className)}>
			<span
				className={cn(
					"font-display font-bold",
					textSize,
					isOnSale
						? "text-destructive drop-shadow-[0_0_10px_rgba(255,0,60,0.5)]"
						: "text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
				)}>
				{formatPrice(Number(price))}
			</span>
			{isOnSale && (
				<span className="text-lg text-muted-foreground line-through">
					{formatPrice(Number(originalPrice))}
				</span>
			)}
		</div>
	);
}
