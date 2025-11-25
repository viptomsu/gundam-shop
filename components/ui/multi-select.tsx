"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

import { cn } from "@/lib/utils";

interface Option {
	label: string;
	value: string;
}

interface MultiSelectProps {
	placeholder?: string;
	options: Option[];
	className?: string;
	value: string[];
	onValueChange: (value: string[]) => void;
}

export function MultiSelect({
	placeholder = "Select...",
	options,
	className,
	value = [],
	onValueChange,
}: MultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");

	const safeValue = Array.isArray(value)
		? value
		: typeof value === "string"
		? [value]
		: [];

	const handleUnselect = React.useCallback(
		(itemValue: string) => {
			const newValues = safeValue.filter((v) => v !== itemValue);
			onValueChange(newValues);
		},
		[safeValue, onValueChange]
	);

	const handleSelect = React.useCallback(
		(itemValue: string) => {
			const newValues = [...safeValue, itemValue];
			onValueChange(newValues);
			setInputValue("");
		},
		[safeValue, onValueChange]
	);

	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (input) {
				if (e.key === "Delete" || e.key === "Backspace") {
					if (input.value === "" && safeValue.length > 0) {
						handleUnselect(safeValue[safeValue.length - 1]);
					}
				}
				if (e.key === "Escape") {
					input.blur();
				}
			}
		},
		[handleUnselect, safeValue]
	);

	const selectables = options.filter(
		(option) => !safeValue.includes(option.value)
	);

	return (
		<Command
			onKeyDown={handleKeyDown}
			className={cn("overflow-visible bg-transparent", className)}>
			<div className="group px-3 py-2 text-sm rounded-none tech-input-base bg-background focus-within:outline-none">
				<div className="flex gap-1 flex-wrap">
					{safeValue.map((itemValue) => {
						const option = options.find((o) => o.value === itemValue);
						return (
							<Badge
								key={itemValue}
								variant="secondary"
								className="rounded-none">
								{option?.label || itemValue}
								<button
									className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUnselect(itemValue);
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => handleUnselect(itemValue)}>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</button>
							</Badge>
						);
					})}
					{/* Avoid having the "Search" Icon */}
					<CommandPrimitive.Input
						ref={inputRef}
						value={inputValue}
						onValueChange={setInputValue}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder}
						className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
					/>
				</div>
			</div>
			<div className="relative mt-2">
				{open && selectables.length > 0 ? (
					<div className="absolute w-full z-10 top-0 rounded-none border bg-popover text-popover-foreground shadow-md outline-none animate-in">
						<CommandList>
							<CommandGroup className="h-full overflow-auto max-h-60">
								{selectables.map((option) => (
									<CommandItem
										key={option.value}
										onSelect={() => {
											handleSelect(option.value);
										}}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										className="rounded-none cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary">
										{option.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</div>
				) : null}
			</div>
		</Command>
	);
}
