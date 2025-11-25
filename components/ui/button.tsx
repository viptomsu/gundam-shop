"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap uppercase text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:drop-shadow-[0_0_8px_rgba(0,225,255,0.5)] relative",
	{
		variants: {
			variant: {
				default:
					"backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.5)] clip-mecha",
				outline: "bg-transparent group", // Background handled by pseudo/child
				ghost: "clip-mecha",
				link: "text-primary underline-offset-4 hover:underline",
			},
			color: {
				primary: "",
				destructive: "",
				secondary: "",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3 clip-mecha",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 clip-mecha",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4 clip-mecha",
				icon: "size-8 rounded-none clip-mecha-sm",
				"icon-sm": "size-7 rounded-none clip-mecha-sm",
				"icon-lg": "size-9 rounded-none clip-mecha-sm",
			},
		},
		compoundVariants: [
			// Default (Fill) + Color
			{
				variant: "default",
				color: "primary",
				class: "bg-primary/80 text-primary-foreground hover:bg-primary/90",
			},
			{
				variant: "default",
				color: "destructive",
				class:
					"bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
			},
			{
				variant: "default",
				color: "secondary",
				class: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
			},
			// Outline + Color (Text only, border handled by logic)
			{
				variant: "outline",
				color: "primary",
				class: "text-primary hover:text-primary-foreground",
			},
			{
				variant: "outline",
				color: "destructive",
				class: "text-destructive hover:text-destructive-foreground",
			},
			{
				variant: "outline",
				color: "secondary",
				class: "text-secondary hover:text-secondary-foreground",
			},
			// Ghost + Color
			{
				variant: "ghost",
				color: "primary",
				class:
					"hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/20",
			},
			{
				variant: "ghost",
				color: "destructive",
				class: "hover:bg-destructive/10 hover:text-destructive",
			},
			{
				variant: "ghost",
				color: "secondary",
				class: "hover:bg-secondary/80 hover:text-secondary-foreground",
			},
		],
		defaultVariants: {
			variant: "default",
			color: "primary",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			color = "primary",
			size = "default",
			asChild = false,
			children,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button";

		// Helper to determine clip class based on size
		const clipClass =
			size === "icon" || size === "icon-sm" || size === "icon-lg"
				? "clip-mecha-sm"
				: "clip-mecha";

		if (variant === "outline") {
			// Determine border and hover colors based on color prop
			const borderColor =
				color === "destructive"
					? "bg-destructive"
					: color === "secondary"
					? "bg-secondary"
					: "bg-input"; // Default/Primary uses input color for border initially

			const hoverBgColor =
				color === "destructive"
					? "hover:bg-destructive"
					: color === "secondary"
					? "hover:bg-secondary"
					: "hover:bg-primary";

			const groupHoverBgColor =
				color === "destructive"
					? "group-hover:bg-destructive"
					: color === "secondary"
					? "group-hover:bg-secondary"
					: "group-hover:bg-primary";

			const groupHoverTextColor =
				color === "destructive"
					? "group-hover:text-white"
					: color === "secondary"
					? "group-hover:text-secondary-foreground"
					: "group-hover:text-primary-foreground";

			return (
				<Comp
					className={cn(
						buttonVariants({ variant, color, size, className }),
						"p-px", // Padding for the border width
						clipClass, // Clip the outer container (the border)
						borderColor,
						hoverBgColor,
						"transition-colors duration-300"
					)}
					ref={ref}
					{...props}>
					<span
						className={cn(
							"flex h-full w-full items-center justify-center gap-2 bg-background transition-colors duration-300",
							groupHoverBgColor,
							groupHoverTextColor,
							clipClass, // Clip the inner content to match
							size === "default" && "px-4 py-2", // Re-apply padding internally
							size === "sm" && "px-3",
							size === "lg" && "px-6"
						)}>
						{children}
					</span>
				</Comp>
			);
		}

		return (
			<Comp
				className={cn(buttonVariants({ variant, color, size, className }))}
				ref={ref}
				{...props}>
				{children}
			</Comp>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
