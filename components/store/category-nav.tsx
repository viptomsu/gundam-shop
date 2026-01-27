import { fetchApi } from "@/lib/api";
import { Category } from "@prisma/client";
import { NavSectionGrid, NavSectionItem } from "./nav-section-grid";

type CategoryWithCount = Category & {
	_count: {
		products: number;
	};
};

type ApiResponse = {
	data: CategoryWithCount[];
	meta: {
		total: number;
	};
};

export async function CategoryNav() {
	let categories: CategoryWithCount[] = [];

	try {
		const response = await fetchApi<ApiResponse>(
			"/api/categories?limit=4&sort=popular",
			{
				next: { revalidate: 60 },
			},
		);
		categories = response.data;
	} catch (error) {
		console.error("Failed to fetch categories:", error);
	}

	if (categories.length === 0) {
		return null;
	}

	const items: NavSectionItem[] = categories.map((cat) => ({
		id: cat.id,
		name: cat.name,
		slug: cat.slug,
		description: cat.description,
		image: cat.image,
		count: cat._count.products,
	}));

	return (
		<NavSectionGrid
			title="Browse Categories"
			viewAllHref="/categories"
			baseHref="/categories"
			items={items}
			badgeLabel="ITEMS"
			actionLabel="EXPLORE"
		/>
	);
}
