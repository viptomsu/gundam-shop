"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormControl } from "@/components/ui/form";
import { GUNDAM_GRADES } from "@/config/constants";

interface GradeSelectProps {
	value?: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function GradeSelect({ value, onChange, disabled }: GradeSelectProps) {
	return (
		<Select
			disabled={disabled}
			onValueChange={onChange}
			value={value}
			defaultValue={value}>
			<FormControl>
				<SelectTrigger>
					<SelectValue placeholder="Select grade" />
				</SelectTrigger>
			</FormControl>
			<SelectContent>
				{GUNDAM_GRADES.map((grade) => (
					<SelectItem key={grade.value} value={grade.value}>
						{grade.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
