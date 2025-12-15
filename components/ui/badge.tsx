import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-none border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden uppercase tracking-wider",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
				destructive:
					"border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
				outline:
					"text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
			},
			color: {
				default: "",
				success: "",
				destructive: "",
				warning: "",
			},
		},
		compoundVariants: [
			// Outline + color combinations
			{
				variant: "outline",
				color: "default",
				className: "border-primary/50 text-primary",
			},
			{
				variant: "outline",
				color: "success",
				className: "border-emerald-500/50 text-emerald-400",
			},
			{
				variant: "outline",
				color: "destructive",
				className: "border-destructive/50 text-destructive",
			},
			{
				variant: "outline",
				color: "warning",
				className: "border-amber-500/50 text-amber-400",
			},
		],
		defaultVariants: {
			variant: "default",
			color: "default",
		},
	}
);

function Badge({
	className,
	variant,
	color,
	asChild = false,
	children,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot : "span";

	if (variant === "outline") {
		// Get color-specific border class for the glow effect
		const glowColorMap = {
			default: "bg-primary/50 hover:bg-primary",
			success: "bg-emerald-500/50 hover:bg-emerald-500",
			destructive: "bg-destructive/50 hover:bg-destructive",
			warning: "bg-amber-500/50 hover:bg-amber-500",
		};
		const glowClass = glowColorMap[color || "default"];

		return (
			<Comp
				data-slot="badge"
				className={cn(
					badgeVariants({ variant, color }),
					`p-px clip-mecha-sm ${glowClass} transition-colors duration-300 border-0`,
					className
				)}
				{...props}>
				<span className="flex h-full w-full items-center justify-center gap-1 bg-background px-2 py-0.5 clip-mecha-sm">
					{children}
				</span>
			</Comp>
		);
	}

	return (
		<Comp
			data-slot="badge"
			className={cn(badgeVariants({ variant, color }), className)}
			{...props}>
			{children}
		</Comp>
	);
}

export { Badge, badgeVariants };
