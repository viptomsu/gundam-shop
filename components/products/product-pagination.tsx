import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { PaginationMeta } from "@/types/product";

interface ProductPaginationProps {
	meta: PaginationMeta;
	buildPageUrl: (page: number) => string;
}

export function ProductPagination({
	meta,
	buildPageUrl,
}: ProductPaginationProps) {
	const { page: currentPage, totalPages, hasPreviousPage, hasNextPage } = meta;

	if (totalPages <= 1) return null;

	return (
		<div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-border/30">
			<Button
				variant="outline"
				size="sm"
				disabled={!hasPreviousPage}
				asChild={hasPreviousPage}>
				{hasPreviousPage ? (
					<Link href={buildPageUrl(currentPage - 1)}>
						<ChevronLeft className="h-4 w-4 mr-1" />
						PREV
					</Link>
				) : (
					<span className="flex items-center">
						<ChevronLeft className="h-4 w-4 mr-1" />
						PREV
					</span>
				)}
			</Button>

			<div className="flex items-center gap-1 px-4">
				<span className="font-mono text-sm text-muted-foreground">Page</span>
				<span className="font-mono text-sm text-primary font-bold">
					{currentPage}
				</span>
				<span className="font-mono text-sm text-muted-foreground">
					of {totalPages}
				</span>
			</div>

			<Button
				variant="outline"
				size="sm"
				disabled={!hasNextPage}
				asChild={hasNextPage}>
				{hasNextPage ? (
					<Link href={buildPageUrl(currentPage + 1)}>
						NEXT
						<ChevronRight className="h-4 w-4 ml-1" />
					</Link>
				) : (
					<span className="flex items-center">
						NEXT
						<ChevronRight className="h-4 w-4 ml-1" />
					</span>
				)}
			</Button>
		</div>
	);
}
