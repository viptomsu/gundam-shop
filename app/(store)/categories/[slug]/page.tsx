import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { fetchApi } from "@/lib/api";
import { CatalogLayout } from "@/components/products/catalog-layout";
import { Grid3X3 } from "lucide-react";
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
		seriesId?: string | string[];
		brandId?: string | string[];
		sort?: string;
	}>;
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug } = await params;

	const category = await prisma.category.findUnique({
		where: { slug },
		select: { name: true },
	});

	if (!category) {
		return { title: "Category Not Found" };
	}

	return {
		title: `${category.name} Category | GundamShop`,
		description: `Browse all ${category.name} Gunpla kits. Find the best model kits at GundamShop.`,
	};
}

export default async function CategoryPage({
	params,
	searchParams,
}: PageProps) {
	const { slug } = await params;
	const queryParams = await searchParams;

	// Fetch category by slug
	const categoryData = await prisma.category.findUnique({
		where: { slug },
		select: { id: true, name: true },
	});

	if (!categoryData) {
		notFound();
	}

	// Build search params for API
	const apiParams = new URLSearchParams();
	apiParams.set("page", queryParams.page || "1");
	apiParams.set("limit", "12");
	apiParams.set("categoryId", categoryData.id);

	const grades = Array.isArray(queryParams.grade)
		? queryParams.grade
		: queryParams.grade
		? [queryParams.grade]
		: [];
	const seriesIds = Array.isArray(queryParams.seriesId)
		? queryParams.seriesId
		: queryParams.seriesId
		? [queryParams.seriesId]
		: [];
	const brandIds = Array.isArray(queryParams.brandId)
		? queryParams.brandId
		: queryParams.brandId
		? [queryParams.brandId]
		: [];

	grades.forEach((g) => apiParams.append("grade", g));
	seriesIds.forEach((s) => apiParams.append("seriesId", s));
	brandIds.forEach((b) => apiParams.append("brandId", b));

	// Add sort parameter
	if (queryParams.sort) {
		apiParams.set("sort", queryParams.sort);
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

	const activeFilterCount = grades.length + seriesIds.length + brandIds.length;

	const buildPageUrl = (page: number) => {
		const newParams = new URLSearchParams();
		newParams.set("page", String(page));
		if (queryParams.sort) newParams.set("sort", queryParams.sort);
		grades.forEach((g) => newParams.append("grade", g));
		seriesIds.forEach((s) => newParams.append("seriesId", s));
		brandIds.forEach((b) => newParams.append("brandId", b));
		return `/categories/${slug}?${newParams.toString()}`;
	};

	const title = (
		<>
			<span className="text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
				{categoryData.name}
			</span>{" "}
			Category
		</>
	);

	return (
		<CatalogLayout
			header={{
				queryType: "CATEGORY_COLLECTION",
				title,
				total: productsResult?.meta.total || 0,
				countLabel: "PRODUCTS",
				icon: <Grid3X3 className="h-5 w-5 text-primary" />,
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
			retryHref={`/categories/${slug}`}
			emptyTitle="No Products Found"
			emptyMessage="No products found in this category. Check back later for new arrivals."
		/>
	);
}
