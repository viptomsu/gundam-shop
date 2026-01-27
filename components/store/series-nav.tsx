import { fetchApi } from "@/lib/api";
import { Series } from "@prisma/client";
import { NavSectionGrid, NavSectionItem } from "./nav-section-grid";

type SeriesWithCount = Series & {
	_count: {
		products: number;
	};
};

type ApiResponse = {
	data: SeriesWithCount[];
	meta: {
		total: number;
	};
};

export async function SeriesNav() {
	let seriesList: SeriesWithCount[] = [];

	try {
		const response = await fetchApi<ApiResponse>(
			"/api/series?limit=4&sort=popular",
			{
				next: { revalidate: 60 },
			},
		);
		seriesList = response.data;
	} catch (error) {
		console.error("Failed to fetch series:", error);
	}

	if (seriesList.length === 0) {
		return null;
	}

	const items: NavSectionItem[] = seriesList.map((series) => ({
		id: series.id,
		name: series.name,
		slug: series.slug,
		description: series.description,
		image: series.image,
		count: series._count.products,
	}));

	return (
		<NavSectionGrid
			title="Browse Series"
			viewAllHref="/series"
			baseHref="/series"
			items={items}
			badgeLabel="UNITS"
			actionLabel="EXPLORE"
		/>
	);
}
