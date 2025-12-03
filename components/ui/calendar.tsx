"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, useDayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CustomDayButton = (props: any) => {
	const { day, modifiers, ...buttonProps } = props;

	const isToday = modifiers?.today;
	const isSelected = modifiers?.selected;
	const isOutside = modifiers?.outside;

	let variant: "default" | "outline" | "ghost" = "ghost";
	let color: "primary" | "accent" | "destructive" | "secondary" = "primary";
	let className = cn(
		buttonProps.className,
		"h-9 w-9 font-normal clip-mecha-sm"
	);

	if (isToday) {
		// Today always uses outline structure (double layer) for the border effect
		variant = "outline";
		color = "accent";
		if (isSelected) {
			// If also selected, override the inner background to be Cyan (Primary) and text to Black
			className = cn(
				className,
				"[&>span]:bg-primary! [&>span]:text-black! [&>span]:hover:bg-primary! [&>span]:hover:text-black!"
			);
		}
	} else if (isSelected) {
		// Selected but not today: Simple filled button
		variant = "default";
		color = "primary";
		className = cn(className, "text-black! hover:text-black!");
	} else {
		// Default state
		if (isOutside) {
			className = cn(
				className,
				"text-muted-foreground opacity-50 hover:bg-accent/20 hover:text-accent hover:opacity-100"
			);
		} else {
			className = cn(className, "hover:bg-primary/20 hover:text-primary");
		}
	}

	return (
		<Button
			{...buttonProps}
			variant={variant}
			color={color}
			size="icon"
			className={className}
			onClick={(e) => {
				buttonProps.onClick?.(e);
			}}
		/>
	);
};

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	...props
}: CalendarProps) {
	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			classNames={{
				months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
				month: "space-y-4",
				month_caption: "flex justify-center pt-1 relative items-center w-full",
				caption_label: "hidden",
				nav: "absolute left-0 top-0 w-full flex justify-between m-0 px-4 pt-6 pointer-events-none h-9 items-center",
				button_previous: "absolute left-1 z-10 pointer-events-auto", // Handled by component
				button_next: "absolute right-1 z-10 pointer-events-auto", // Handled by component
				month_grid: "w-full border-collapse space-y-1",
				weekdays: "flex",
				weekday:
					"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] uppercase",
				week: "flex w-full mt-2",
				day: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
				day_button: cn(
					// Base styles that don't conflict with Button
					"h-full w-full p-0 font-normal aria-selected:opacity-100"
				),
				range_end: "day-range-end",
				selected: "", // Handled by CustomDayButton
				today: "", // Handled by CustomDayButton
				outside: "day-outside text-muted-foreground opacity-50", // Remove bg-accent
				disabled: "text-muted-foreground opacity-50",
				range_middle:
					"aria-selected:bg-accent aria-selected:text-accent-foreground",
				hidden: "invisible",
				...classNames,
			}}
			components={
				{
					Chevron: ({ ...props }) => {
						if (props.orientation === "left") {
							return <ChevronLeft className="h-4 w-4" />;
						}
						return <ChevronRight className="h-4 w-4" />;
					},
					DayButton: CustomDayButton,
					PreviousMonthButton: (props: any) => (
						<Button
							{...props}
							type="button"
							variant="outline"
							size="icon"
							className="h-7 w-7 bg-transparent p-0 opacity-100 hover:opacity-100 text-primary z-10 pointer-events-auto"
						/>
					),
					NextMonthButton: (props: any) => (
						<Button
							{...props}
							type="button"
							variant="outline"
							size="icon"
							className="h-7 w-7 bg-transparent p-0 opacity-100 hover:opacity-100 text-primary z-10 pointer-events-auto"
						/>
					),
				} as any
			}
			captionLayout="dropdown"
			fromYear={1900}
			toYear={2100}
			{...props}
		/>
	);
}
Calendar.displayName = "Calendar";

export { Calendar };
