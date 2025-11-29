import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
	"rounded-none relative overflow-hidden transition-all duration-300",
	{
		variants: {
			variant: {
				sensor:
					"bg-card/40 text-card-foreground [clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)]",
				armor:
					"bg-card text-card-foreground border border-border [&_[data-slot=card-header]]:border-b [&_[data-slot=card-header]]:border-border",
				slot: "bg-card text-card-foreground border-l-4 border-l-muted hover:border-l-primary data-[active=true]:border-l-primary",
			},
		},
		defaultVariants: {
			variant: "armor",
		},
	}
);

function Card({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
	return (
		<div
			data-slot="card"
			className={cn(cardVariants({ variant }), className)}
			{...props}>
			{/* Sensor Variant Decoration */}
			{variant === "sensor" && (
				<div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-primary to-transparent pointer-events-none" />
			)}

			{/* Armor Variant Decoration */}
			{variant === "armor" && (
				<div className="absolute top-0 right-0 w-1.5 h-1.5 bg-primary pointer-events-none" />
			)}

			{props.children}
		</div>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 p-4 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
				className
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-title"
			className={cn("leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div data-slot="card-content" className={cn("p-4", className)} {...props} />
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center p-4 pt-0", className)}
			{...props}
		/>
	);
}

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};
