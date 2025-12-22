"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "@/types/product";

interface SortSelectProps {
	currentSort?: string;
}

export function SortSelect({ currentSort }: SortSelectProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleSortChange = useCallback(
		(value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("sort", value);
			// Reset to page 1 when sort changes
			params.delete("page");
			router.push(`?${params.toString()}`, { scroll: false });
		},
		[router, searchParams]
	);

	return (
		<Select
			defaultValue={currentSort || "newest"}
			onValueChange={handleSortChange}>
			<SelectTrigger className="w-[180px] h-9">
				<SelectValue placeholder="Sort by..." />
			</SelectTrigger>
			<SelectContent>
				{SORT_OPTIONS.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
