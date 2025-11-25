"use client";

import { useEffect } from "react";
import { Control, UseFormSetValue, Path, FieldValues } from "react-hook-form";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface SlugFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: Path<T>;
	sourceValue: string;
	setValue: UseFormSetValue<T>;
	disabled?: boolean;
	placeholder?: string;
	isEditing?: boolean;
	label?: string;
}

export function SlugField<T extends FieldValues>({
	control,
	name,
	sourceValue,
	setValue,
	disabled,
	placeholder = "slug",
	isEditing = false,
	label = "Slug",
}: SlugFieldProps<T>) {
	useEffect(() => {
		if (!isEditing && sourceValue) {
			const slug = sourceValue
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)+/g, "");
			setValue(name, slug as any, { shouldValidate: true });
		}
	}, [sourceValue, isEditing, setValue, name]);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<FormControl>
						<Input disabled={disabled} placeholder={placeholder} {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
