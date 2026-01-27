import { Suspense, type ReactNode } from "react";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductPagination } from "@/components/products/product-pagination";
import { SortSelect } from "@/components/products/sort-select";
import {
	EmptyState,
	ErrorState,
	FiltersSkeleton,
} from "@/components/products/catalog-states";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { SlidersHorizontal, Scan } from "lucide-react";
import type { Product, PaginationMeta, FilterOption } from "@/types/product";

interface CatalogHeaderProps {
	/** Terminal-style breadcrumb path (e.g., "SERIES_COLLECTION") */
	queryType: string;
	/** Main title element */
	title: ReactNode;
	/** Optional description text */
	description?: string | null;
	/** Total count to display in badge */
	total: number;
	/** Label for the count badge (e.g., "UNITS", "PRODUCTS") */
	countLabel?: string;
	/** Optional icon element */
	icon?: ReactNode;
}

interface CatalogLayoutProps {
	// Header
	header: CatalogHeaderProps;

	// Data
	products: Product[] | null;
	error: string | null;

	// Pagination
	meta: PaginationMeta | null;
	buildPageUrl: (page: number) => string;

	// Filters
	gradeOptions: FilterOption[];
	seriesOptions: FilterOption[];
	brandOptions: FilterOption[];
	activeFilterCount: number;

	// Sort
	currentSort?: string;

	// Error handling
	retryHref: string;

	// Empty state customization
	emptyTitle?: string;
	emptyMessage?: string;
}

export function CatalogLayout({
	header,
	products,
	error,
	meta,
	buildPageUrl,
	gradeOptions,
	seriesOptions,
	brandOptions,
	activeFilterCount,
	currentSort,
	retryHref,
	emptyTitle,
	emptyMessage,
}: CatalogLayoutProps) {
	const total = meta?.total || 0;

	return (
		<div className="min-h-screen bg-background">
			{/* Page Header */}
			<div className="border-b border-border/50 bg-card/30 backdrop-blur-sm">
				<div className="container px-4 md:px-6 py-8">
					<div className="flex flex-col gap-3">
						{/* Terminal-style path */}
						<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
							<Scan className="h-3 w-3" />
							<span>DATABASE_QUERY</span>
							<span className="text-primary">//</span>
							<span>{header.queryType}</span>
						</div>

						{/* Title with optional icon */}
						<div className="flex items-center gap-3">
							{header.icon && (
								<div className="h-10 w-10 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
									{header.icon}
								</div>
							)}
							<h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight">
								{header.title}
							</h1>
						</div>

						{/* Description */}
						{header.description && (
							<p className="text-muted-foreground max-w-2xl mt-2">
								{header.description}
							</p>
						)}

						{/* Count badge */}
						<div className="flex items-center gap-2 mt-2">
							<Badge variant="outline" className="font-mono text-xs">
								{header.total} {header.countLabel || "UNITS"}
							</Badge>
						</div>
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="container px-4 md:px-6 py-8">
				<div className="flex gap-8">
					{/* Desktop Sidebar */}
					<aside className="hidden lg:block w-64 shrink-0">
						<div className="sticky top-24">
							<div className="bg-card/50 border border-border/50 p-4 backdrop-blur-sm">
								<Suspense fallback={<FiltersSkeleton />}>
									<ProductFilters
										grades={gradeOptions}
										series={seriesOptions}
										brands={brandOptions}
									/>
								</Suspense>
							</div>
						</div>
					</aside>

					{/* Main Content */}
					<main className="flex-1 min-w-0">
						{/* Toolbar */}
						<div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border/30">
							<div className="flex items-center gap-3">
								{/* Mobile Filter Button */}
								<Sheet>
									<SheetTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="lg:hidden gap-2">
											<SlidersHorizontal className="h-4 w-4" />
											Filters
											{activeFilterCount > 0 && (
												<Badge
													variant="default"
													className="h-5 w-5 p-0 flex items-center justify-center text-[10px]">
													{activeFilterCount}
												</Badge>
											)}
										</Button>
									</SheetTrigger>
									<SheetContent side="left" className="w-80">
										<SheetHeader>
											<SheetTitle className="font-mono text-primary">
												FILTER_SYSTEM
											</SheetTitle>
										</SheetHeader>
										<div className="mt-6 px-4">
											<Suspense fallback={<FiltersSkeleton />}>
												<ProductFilters
													grades={gradeOptions}
													series={seriesOptions}
													brands={brandOptions}
												/>
											</Suspense>
										</div>
									</SheetContent>
								</Sheet>

								{/* Results Count */}
								<div className="text-sm text-muted-foreground font-mono">
									<span className="text-primary">{total}</span> units found
								</div>
							</div>

							{/* Sort Dropdown */}
							<SortSelect currentSort={currentSort} />
						</div>

						{/* Error State */}
						{error && <ErrorState message={error} retryHref={retryHref} />}

						{/* Empty State */}
						{!error && products?.length === 0 && (
							<EmptyState
								title={emptyTitle}
								message={emptyMessage}
								linkHref={retryHref}
							/>
						)}

						{/* Products Grid */}
						{!error && products && products.length > 0 && (
							<>
								<ProductGrid products={products} />

								{/* Pagination */}
								{meta && (
									<ProductPagination meta={meta} buildPageUrl={buildPageUrl} />
								)}
							</>
						)}
					</main>
				</div>
			</div>
		</div>
	);
}
