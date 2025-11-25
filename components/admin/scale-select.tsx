"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { GUNDAM_SCALES } from "@/config/constants";

interface ScaleSelectProps {
	value?: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function ScaleSelect({ value, onChange, disabled }: ScaleSelectProps) {
	return (
		<Select
			disabled={disabled}
			onValueChange={onChange}
			value={value}
			defaultValue={value}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder="Select scale" />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{GUNDAM_SCALES.map((scale) => (
					<SelectItem key={scale.value} value={scale.value}>
						{scale.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
