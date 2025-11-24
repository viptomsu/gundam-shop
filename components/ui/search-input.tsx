"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useUrlParams } from "@/hooks/use-url-params";

interface SearchInputProps {
	placeholder?: string;
}

export function SearchInput({ placeholder = "Search..." }: SearchInputProps) {
	const [params, setParams] = useUrlParams({ search: "" });
	const [value, setValue] = useState(params.search || "");

	useEffect(() => {
		setValue(params.search || "");
	}, [params.search]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			if (value !== params.search) {
				setParams((prev) => ({ ...prev, search: value, page: 1 }));
			}
		}, 500);

		return () => clearTimeout(timeoutId);
	}, [value, params.search, setParams]);

	return (
		<div className="relative w-full max-w-sm">
			<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
			<Input
				placeholder={placeholder}
				value={value}
				onChange={(e) => setValue(e.target.value)}
				className="pl-8"
			/>
		</div>
	);
}
