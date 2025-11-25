"use client";

import * as React from "react";
import { RiCloseLine } from "react-icons/ri";
import { ChevronDown, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Option {
	label: string;
	value: string;
}

interface TagInputProps {
	options: Option[];
	value: string[];
	onChange: (value: string[]) => void;
	onCreate?: (label: string) => Promise<Option | void>;
	placeholder?: string;
	disabled?: boolean;
}

export function TagInput({
	options,
	value,
	onChange,
	onCreate,
	placeholder = "Select...",
	disabled,
}: TagInputProps) {
	const [open, setOpen] = React.useState(false);
	const [inputValue, setInputValue] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	const selected = value
		.map((v) => options.find((o) => o.value === v))
		.filter(Boolean) as Option[];

	const handleUnselect = (item: Option) => {
		onChange(value.filter((v) => v !== item.value));
	};

	const handleCreate = async () => {
		if (!onCreate || !inputValue) return;
		setLoading(true);
		try {
			const newOption = await onCreate(inputValue);
			if (newOption) {
				onChange([...value, newOption.value]);
				setInputValue("");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex flex-wrap gap-1">
				{selected.map((item) => (
					<Badge key={item.value} variant="secondary">
						{item.label}
						<Button
							variant="ghost"
							color="destructive"
							size="icon"
							className="h-3 w-3 p-0"
							onClick={() => handleUnselect(item)}>
							<RiCloseLine className="h-3 w-3" />
							<span className="sr-only">Remove {item.label}</span>
						</Button>
					</Badge>
				))}
			</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<PopoverTrigger asChild>
						<div
							role="combobox"
							aria-expanded={open}
							className={cn(
								"flex h-9 w-full items-center justify-between rounded-none border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
								disabled && "opacity-50 cursor-not-allowed"
							)}
							onClick={() => !disabled && setOpen(!open)}>
							{placeholder}
							<ChevronDown className="h-4 w-4 opacity-50" />
						</div>
					</PopoverTrigger>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0" align="start">
					<Command>
						<CommandInput
							placeholder="Search or create..."
							value={inputValue}
							onValueChange={setInputValue}
						/>
						<CommandList>
							<CommandGroup className="max-h-64 overflow-auto">
								{options.map((option) => (
									<CommandItem
										key={option.value}
										onSelect={() => {
											if (value.includes(option.value)) {
												onChange(value.filter((v) => v !== option.value));
											} else {
												onChange([...value, option.value]);
											}
											setOpen(false);
										}}
										className="data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary cursor-pointer">
										<div
											className={cn(
												"mr-2 flex h-4 w-4 items-center justify-center opacity-0 transition-opacity",
												value.includes(option.value) && "opacity-100"
											)}>
											<Check className="h-4 w-4 text-primary" />
										</div>
										{option.label}
									</CommandItem>
								))}
								{onCreate &&
									inputValue &&
									!options.some(
										(o) => o.label.toLowerCase() === inputValue.toLowerCase()
									) && (
										<CommandItem
											onSelect={handleCreate}
											className="cursor-pointer text-muted-foreground">
											Create "{inputValue}"
										</CommandItem>
									)}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);
}
