"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Scan } from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
		"aria-invalid"?: boolean;
	}
>(({ className, children, "aria-invalid": ariaInvalid, ...props }, ref) => (
	<SelectPrimitive.Trigger
		ref={ref}
		aria-invalid={ariaInvalid}
		className={cn(
			"flex h-9 w-full items-center justify-between rounded-none bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 tech-input-base font-mono tracking-wide",
			className
		)}
		{...props}>
		{children}
		<SelectPrimitive.Icon asChild>
			<ChevronDown className="h-4 w-4 opacity-50" />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollUpButton
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className
		)}
		{...props}>
		<ChevronUp className="h-4 w-4" />
	</SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.ScrollDownButton
		ref={ref}
		className={cn(
			"flex cursor-default items-center justify-center py-1",
			className
		)}
		{...props}>
		<ChevronDown className="h-4 w-4" />
	</SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
	SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(
	(
		{ className, children, position = "popper", sideOffset = 4, ...props },
		ref
	) => (
		<SelectPrimitive.Portal>
			<SelectPrimitive.Content
				ref={ref}
				className={cn(
					"relative z-50 max-h-96 min-w-32 overflow-hidden outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					position === "popper" &&
						"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
					className
				)}
				position={position}
				sideOffset={sideOffset}
				{...props}>
				{/* Border Layer */}
				<div className="bg-primary/30 p-px drop-shadow-[0_0_10px_rgba(6,182,212,0.3)] [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]">
					{/* Content Layer */}
					<div className="bg-black/90 backdrop-blur-sm text-popover-foreground w-full h-full font-mono tracking-wide [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]">
						<SelectScrollUpButton />
						<SelectPrimitive.Viewport
							className={cn(
								"p-1",
								position === "popper" &&
									"w-full min-w-(--radix-select-trigger-width)"
							)}>
							{children}
						</SelectPrimitive.Viewport>
						<SelectScrollDownButton />
					</div>
				</div>
			</SelectPrimitive.Content>
		</SelectPrimitive.Portal>
	)
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Label
		ref={ref}
		className={cn(
			"py-1.5 pl-2 pr-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground font-mono",
			className
		)}
		{...props}
	/>
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
	<SelectPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex w-full cursor-default select-none items-center rounded-none border-l-2 border-transparent py-1.5 pl-2 pr-2 text-sm outline-none focus:bg-primary/10 focus:text-primary focus:border-primary data-[state=checked]:text-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-disabled:pointer-events-none data-disabled:opacity-50 font-mono tracking-wide",
			className
		)}
		{...props}>
		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
	React.ElementRef<typeof SelectPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<SelectPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-muted", className)}
		{...props}
	/>
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const SelectEmpty = React.forwardRef<
	HTMLDivElement,
	React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest",
			className
		)}
		{...props}>
		<Scan className="h-6 w-6 mb-2 opacity-50" />
		<span>No Data</span>
	</div>
));
SelectEmpty.displayName = "SelectEmpty";

export {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectLabel,
	SelectItem,
	SelectSeparator,
	SelectScrollUpButton,
	SelectScrollDownButton,
	SelectEmpty,
};
