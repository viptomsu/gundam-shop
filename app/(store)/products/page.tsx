import { fetchApi } from "@/lib/api";
import { CatalogLayout } from "@/components/products/catalog-layout";
import { Search } from "lucide-react";
import { GUNDAM_GRADES } from "@/config/constants";
import type {
	ProductsResponse,
	BrandsResponse,
	SeriesResponse,
	Brand,
	Series,
} from "@/types/product";

interface PageProps {
	searchParams: Promise<{
		page?: string;
		search?: string;
		grade?: string | string[];
		seriesId?: string | string[];
		brandId?: string | string[];
		sort?: string;
	}>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
	const params = await searchParams;

	// Build search params for API
	const apiParams = new URLSearchParams();
	apiParams.set("page", params.page || "1");
	apiParams.set("limit", "12");

	if (params.search) {
		apiParams.set("search", params.search);
	}

	// Filters (handle both single and array values)
	const grades = Array.isArray(params.grade)
		? params.grade
		: params.grade
		? [params.grade]
		: [];
	const seriesIds = Array.isArray(params.seriesId)
		? params.seriesId
		: params.seriesId
		? [params.seriesId]
		: [];
	const brandIds = Array.isArray(params.brandId)
		? params.brandId
		: params.brandId
		? [params.brandId]
		: [];

	grades.forEach((g) => apiParams.append("grade", g));
	seriesIds.forEach((s) => apiParams.append("seriesId", s));
	brandIds.forEach((b) => apiParams.append("brandId", b));

	// Add sort parameter
	if (params.sort) {
		apiParams.set("sort", params.sort);
	}

	// Fetch data
	let productsResult: ProductsResponse | null = null;
	let brands: Brand[] = [];
	let series: Series[] = [];
	let error: string | null = null;

	try {
		const [productsRes, brandsRes, seriesRes] = await Promise.all([
			fetchApi<ProductsResponse>(`/api/products?${apiParams.toString()}`, {
				cache: "no-store",
			}),
			fetchApi<BrandsResponse>("/api/brands", {
				cache: "force-cache",
				next: { revalidate: 3600 },
			}),
			fetchApi<SeriesResponse>("/api/series", {
				cache: "force-cache",
				next: { revalidate: 3600 },
			}),
		]);

		productsResult = productsRes;
		brands = brandsRes.data || [];
		series = seriesRes.data || [];
	} catch (e) {
		console.error("Failed to fetch products:", e);
		error = "Failed to load products. Please try again later.";
	}

	// Prepare filter options
	const gradeOptions = GUNDAM_GRADES.map((g) => ({
		id: g.value,
		name: g.label,
	}));
	const seriesOptions = series.map((s) => ({ id: s.id, name: s.name }));
	const brandOptions = brands.map((b) => ({ id: b.id, name: b.name }));

	// Active filter count
	const activeFilterCount = grades.length + seriesIds.length + brandIds.length;

	// Build page URL helper
	const buildPageUrl = (page: number) => {
		const newParams = new URLSearchParams();
		newParams.set("page", String(page));
		if (params.search) newParams.set("search", params.search);
		if (params.sort) newParams.set("sort", params.sort);
		grades.forEach((g) => newParams.append("grade", g));
		seriesIds.forEach((s) => newParams.append("seriesId", s));
		brandIds.forEach((b) => newParams.append("brandId", b));
		return `/products?${newParams.toString()}`;
	};

	// Build title with search indicator
	const title = (
		<>
			Mobile Suit{" "}
			<span className="text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
				Arsenal
			</span>
			{params.search && (
				<div className="flex items-center gap-2 mt-2 text-base font-normal">
					<Search className="h-4 w-4 text-muted-foreground" />
					<span className="text-sm text-muted-foreground">
						Search results for:{" "}
						<span className="text-foreground font-medium">
							&ldquo;{params.search}&rdquo;
						</span>
					</span>
				</div>
			)}
		</>
	);

	return (
		<CatalogLayout
			header={{
				queryType: "PRODUCT_CATALOG",
				title,
				total: productsResult?.meta.total || 0,
				countLabel: "UNITS",
			}}
			products={productsResult?.data || null}
			error={error}
			meta={productsResult?.meta || null}
			buildPageUrl={buildPageUrl}
			gradeOptions={gradeOptions}
			seriesOptions={seriesOptions}
			brandOptions={brandOptions}
			activeFilterCount={activeFilterCount}
			currentSort={params.sort}
			retryHref="/products"
		/>
	);
}
