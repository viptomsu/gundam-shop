import { prisma } from "@/lib/prisma";
import { StoreCard } from "@/components/store/store-card";
import { SectionHeader } from "@/components/store/section-header";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
	const categories = await prisma.category.findMany({
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
					title="Grade & Scale System"
					subtitle="Browse kits by grade, scale, and product type."
				/>
			</section>

			{/* Content Grid */}
			<section className="container px-4 md:px-6">
				{categories.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
						<p>No categories found in the database.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{categories.map((category) => (
							<StoreCard
								key={category.id}
								title={category.name}
								description={category.description}
								image={category.image}
								href={`/categories/${category.slug}`}
								count={category._count.products}
								countLabel="ITEMS"
								variant="primary"
							/>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
