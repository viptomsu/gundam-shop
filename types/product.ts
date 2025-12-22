// Shared types for product catalog pages

export interface ProductVariant {
	id: string;
	name: string;
	price: string;
	salePrice: string | null;
	stock: number;
	image: string | null;
}

export interface Brand {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	logo?: string | null;
}

export interface Series {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	image?: string | null;
}

export interface Category {
	id: string;
	name: string;
	slug: string;
}

export interface Product {
	id: string;
	name: string;
	slug: string;
	description: string;
	images: string[];
	grade: string | null;
	scale: string | null;
	brand: Brand | null;
	variants: ProductVariant[];
	minPrice: number;
	maxPrice: number;
	totalStock: number;
	createdAt: string;
}

export interface ProductsResponse {
	data: Product[];
	meta: PaginationMeta;
}

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
}

export interface BrandsResponse {
	data: Brand[];
}

export interface SeriesResponse {
	data: Series[];
}

export interface FilterOption {
	id: string;
	name: string;
}

// Sort options constant
export const SORT_OPTIONS = [
	{ value: "newest", label: "Newest First" },
	{ value: "oldest", label: "Oldest First" },
	{ value: "price-asc", label: "Price: Low to High" },
	{ value: "price-desc", label: "Price: High to Low" },
	{ value: "name-asc", label: "Name: A-Z" },
	{ value: "name-desc", label: "Name: Z-A" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
