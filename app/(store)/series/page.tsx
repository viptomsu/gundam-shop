import { prisma } from "@/lib/prisma";
import { StoreCard } from "@/components/store/store-card";
import { SectionHeader } from "@/components/store/section-header";

export const dynamic = "force-dynamic";

export default async function SeriesPage() {
	const seriesList = await prisma.series.findMany({
		orderBy: { name: "asc" },
		include: {
			_count: {
				select: { products: true },
			},
		},
	});

	return (
		<main className="min-h-screen bg-background pb-20">
			{/* Header Section */}
			<section className="container px-4 md:px-6 pt-8 pb-4">
				<SectionHeader
					title="Timeline Database"
					subtitle="Browse Gunpla kits by series and timeline."
				/>
			</section>

			{/* Content Grid */}
			<section className="container px-4 md:px-6">
				{seriesList.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
						<p>No series found in the database.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{seriesList.map((series) => (
							<StoreCard
								key={series.id}
								title={series.name}
								description={series.description}
								image={series.image}
								href={`/series/${series.slug}`}
								count={series._count.products}
								countLabel="UNITS"
								variant="primary"
							/>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
