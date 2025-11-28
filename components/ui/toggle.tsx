"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
	"inline-flex items-center justify-center rounded-none text-sm font-medium transition-colors hover:bg-primary/50 disabled:pointer-events-none disabled:opacity-50 aria-[pressed=true]:bg-primary aria-[pressed=true]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background clip-mecha-sm [&[aria-pressed=true]>span]:!bg-transparent",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				outline:
					"bg-primary/20 hover:bg-primary/40 aria-[pressed=true]:bg-primary aria-[pressed=true]:shadow-[0_0_10px_rgba(6,182,212,0.5)]",
			},
			size: {
				default: "h-9 min-w-9",
				sm: "h-8 min-w-8",
				lg: "h-10 min-w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

const Toggle = ({
	className,
	variant,
	size,
	children,
	...props
}: React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
	VariantProps<typeof toggleVariants>) => (
	<TogglePrimitive.Root
		data-slot="toggle"
		className={cn(
			toggleVariants({ variant, size, className }),
			"p-px border-0"
		)}
		{...props}>
		<span className="flex h-full w-full items-center justify-center gap-2 bg-background clip-mecha-sm px-2">
			{children}
		</span>
	</TogglePrimitive.Root>
);

export { Toggle, toggleVariants };
