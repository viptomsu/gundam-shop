import { cn } from "@/lib/utils";
import { Tag } from "lucide-react";

interface Variant {
	id: string;
	name: string;
	stock: number;
}

interface VariantSelectorProps {
	variants: Variant[];
	selectedVariant: Variant | null;
	onSelect: (variant: any) => void; // Using any to be compatible with different Variant types (Prisma vs Local)
	label?: string;
	className?: string;
	size?: "sm" | "default";
}

export function VariantSelector({
	variants,
	selectedVariant,
	onSelect,
	label = "Select Configuration",
	className,
	size = "default",
}: VariantSelectorProps) {
	if (variants.length <= 0) return null;

	const paddingClass =
		size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

	return (
		<div className={cn("space-y-3", className)}>
			<div className="font-mono text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2">
				<Tag className="h-3 w-3" />
				{label}
			</div>
			<div className="flex flex-wrap gap-2">
				{variants.map((variant) => (
					<button
						key={variant.id}
						onClick={() => onSelect(variant)}
						className={cn(
							"relative font-mono uppercase tracking-wider border transition-all duration-300",
							paddingClass,
							variant.id === selectedVariant?.id
								? "bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.3)]"
								: "bg-transparent border-border hover:border-primary/50 text-muted-foreground hover:text-foreground",
							variant.stock === 0 && "opacity-50"
						)}>
						{variant.name}
						{variant.stock === 0 && (
							<span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
						)}
					</button>
				))}
			</div>
		</div>
	);
}
