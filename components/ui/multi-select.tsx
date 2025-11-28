"use client";

import * as React from "react";
import { X, Scan } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandEmpty,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div className="group px-3 py-2 text-sm rounded-none tech-input-base bg-background focus-within:outline-none flex gap-1 flex-wrap cursor-text">
						{safeValue.map((itemValue) => {
							const option = options.find((o) => o.value === itemValue);
							return (
								<Badge
									key={itemValue}
									variant="secondary"
									className="rounded-none font-mono tracking-wide">
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
							onValueChange={(value) => {
								setInputValue(value);
								setOpen(true);
							}}
							onFocus={() => setOpen(true)}
							onClick={(e) => e.stopPropagation()}
							placeholder={placeholder}
							className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
						/>
					</div>
				</PopoverTrigger>
				<PopoverContent
					className="w-(--radix-popover-trigger-width) p-0"
					onOpenAutoFocus={(e) => e.preventDefault()}>
					<CommandList>
						<CommandEmpty className="flex flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground font-mono uppercase tracking-widest">
							<Scan className="h-6 w-6 mb-2 opacity-50" />
							<span>No Data</span>
						</CommandEmpty>
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
									className="rounded-none cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary font-mono tracking-wide">
									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</PopoverContent>
			</Popover>
		</Command>
	);
}
