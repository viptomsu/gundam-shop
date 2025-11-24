"use client";

import { Button } from "@/components/ui/button";
import { PaginatedResult } from "@/types/pagination";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaginationProps {
	meta: PaginatedResult<any>["meta"];
	onChange: (params: { page: number; limit: number }) => void;
	limit?: number;
	options?: number[];
}

export function Pagination({
	meta,
	onChange,
	limit,
	options = [10, 20, 50, 100],
}: PaginationProps) {
	const { page, totalPages, hasNextPage, hasPreviousPage } = meta;
	const currentLimit = limit || meta.limit;

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-2 py-4">
			<Button
				variant="outline"
				size="sm"
				onClick={() => onChange({ page: page - 1, limit: currentLimit })}
				disabled={!hasPreviousPage}>
				<ChevronLeft className="h-4 w-4" />
				Previous
			</Button>
			<div className="flex items-center gap-x-2">
				<div className="text-sm text-muted-foreground">
					Page {page} of {totalPages || 1}
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="h-8 gap-1">
							{currentLimit} / page
							<ChevronDown className="h-3 w-3" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{options.map((l) => (
							<DropdownMenuItem
								key={l}
								onClick={() => onChange({ page: 1, limit: l })}
								className={l === currentLimit ? "bg-accent" : ""}>
								{l}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Button
				variant="outline"
				size="sm"
				onClick={() => onChange({ page: page + 1, limit: currentLimit })}
				disabled={!hasNextPage}>
				Next
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	);
}
