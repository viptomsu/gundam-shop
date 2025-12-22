import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { fetchApi } from "@/lib/api";
import { CatalogLayout } from "@/components/products/catalog-layout";
import { Layers } from "lucide-react";
import { GUNDAM_GRADES } from "@/config/constants";
import type {
	ProductsResponse,
	BrandsResponse,
	SeriesResponse,
	Brand,
	Series,
} from "@/types/product";

interface PageProps {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{
		page?: string;
		grade?: string | string[];
		brandId?: string | string[];
		sort?: string;
	}>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;

	const series = await prisma.series.findUnique({
		where: { slug },
		select: { name: true, description: true },
	});

	if (!series) {
		return { title: "Series Not Found" };
	}

	return {
		title: `${series.name} Series | GundamShop`,
		description:
			series.description ||
			`Browse all mobile suits from the ${series.name} series.`,
	};
}

export default async function SeriesPage({ params, searchParams }: PageProps) {
	const { slug } = await params;
	const queryParams = await searchParams;

	// Fetch series by slug
	const seriesData = await prisma.series.findUnique({
		where: { slug },
		select: { id: true, name: true, description: true },
	});

	if (!seriesData) {
		notFound();
	}

	// Build search params for API
	const apiParams = new URLSearchParams();
	apiParams.set("page", queryParams.page || "1");
	apiParams.set("limit", "12");
	apiParams.set("seriesId", seriesData.id);

	const grades = Array.isArray(queryParams.grade)
		? queryParams.grade
		: queryParams.grade
		? [queryParams.grade]
		: [];
	const brandIds = Array.isArray(queryParams.brandId)
		? queryParams.brandId
		: queryParams.brandId
		? [queryParams.brandId]
		: [];

	grades.forEach((g) => apiParams.append("grade", g));
	brandIds.forEach((b) => apiParams.append("brandId", b));

	// Add sort parameter
	if (queryParams.sort) {
		apiParams.set("sort", queryParams.sort);
	}

	// Fetch data
	let productsResult: ProductsResponse | null = null;
	let brands: Brand[] = [];
	let allSeries: Series[] = [];
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
		allSeries = seriesRes.data || [];
	} catch (e) {
		console.error("Failed to fetch products:", e);
		error = "Failed to load products. Please try again later.";
	}

	// Prepare filter options
	const gradeOptions = GUNDAM_GRADES.map((g) => ({
		id: g.value,
		name: g.label,
	}));
	const seriesOptions = allSeries.map((s) => ({ id: s.id, name: s.name }));
	const brandOptions = brands.map((b) => ({ id: b.id, name: b.name }));

	const activeFilterCount = grades.length + brandIds.length;

	const buildPageUrl = (page: number) => {
		const newParams = new URLSearchParams();
		newParams.set("page", String(page));
		if (queryParams.sort) newParams.set("sort", queryParams.sort);
		grades.forEach((g) => newParams.append("grade", g));
		brandIds.forEach((b) => newParams.append("brandId", b));
		return `/series/${slug}?${newParams.toString()}`;
	};

	const title = (
		<>
			{seriesData.name}{" "}
			<span className="text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
				Series
			</span>
		</>
	);

	return (
		<CatalogLayout
			header={{
				queryType: "SERIES_COLLECTION",
				title,
				description: seriesData.description,
				total: productsResult?.meta.total || 0,
				countLabel: "UNITS",
				icon: <Layers className="h-5 w-5 text-primary" />,
			}}
			products={productsResult?.data || null}
			error={error}
			meta={productsResult?.meta || null}
			buildPageUrl={buildPageUrl}
			gradeOptions={gradeOptions}
			seriesOptions={seriesOptions}
			brandOptions={brandOptions}
			activeFilterCount={activeFilterCount}
			currentSort={queryParams.sort}
			retryHref={`/series/${slug}`}
			emptyTitle="No Units Found"
			emptyMessage="No mobile suits found in this series. Check back later for new arrivals."
		/>
	);
}
