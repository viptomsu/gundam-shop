"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectEmpty,
} from "@/components/ui/select";

interface DataSelectProps {
	options: { label: string; value: string }[];
	value?: string;
	onValueChange: (value: string) => void;
	placeholder?: string;
	isLoading?: boolean;
	disabled?: boolean;
	emptyText?: string;
	className?: string;
}

export function DataSelect({
	options,
	value,
	onValueChange,
	placeholder = "Select...",
	isLoading = false,
	disabled = false,
	emptyText = "No Data",
	className,
}: DataSelectProps) {
	return (
		<Select
			value={value}
			onValueChange={onValueChange}
			disabled={disabled || isLoading}>
			<SelectTrigger className={className}>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{isLoading ? (
					<div className="flex items-center justify-center py-6 text-muted-foreground">
						<Loader2 className="h-4 w-4 animate-spin mr-2" />
						<span className="text-xs font-mono uppercase tracking-widest">
							Loading...
						</span>
					</div>
				) : options.length === 0 ? (
					<SelectEmpty />
				) : (
					options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))
				)}
			</SelectContent>
		</Select>
	);
}
