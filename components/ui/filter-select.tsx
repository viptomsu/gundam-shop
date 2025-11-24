"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUrlParams } from "@/hooks/use-url-params";

interface FilterSelectProps {
	paramName: string;
	placeholder?: string;
	options: { label: string; value: string }[];
}

export function FilterSelect({
	paramName,
	placeholder = "Filter",
	options,
}: FilterSelectProps) {
	const [params, setParams] = useUrlParams();
	const value = (params[paramName] as string) || "all";

	const onValueChange = (newValue: string) => {
		if (newValue === "all") {
			// Remove the param if "all" is selected
			const newParams = { ...params };
			delete newParams[paramName];
			// Reset page to 1
			setParams({ ...newParams, page: 1 });
		} else {
			setParams((prev) => ({ ...prev, [paramName]: newValue, page: 1 }));
		}
	};

	return (
		<Select
			value={value === "all" ? undefined : value}
			onValueChange={onValueChange}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">All</SelectItem>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
