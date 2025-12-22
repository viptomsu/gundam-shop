import { prisma } from "@/lib/prisma";
import { StoreCard } from "@/components/store/store-card";
import { SectionHeader } from "@/components/store/section-header";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
	const brands = await prisma.brand.findMany({
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
					title="Partner Brands"
					subtitle="Official Gunpla manufacturers and partners."
				/>
			</section>

			{/* Content Grid */}
			<section className="container px-4 md:px-6">
				{brands.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
						<p>No brands found in the database.</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						{brands.map((brand) => (
							<StoreCard
								key={brand.id}
								title={brand.name}
								description={brand.description}
								image={brand.logo}
								href={`/brands/${brand.slug}`}
								count={brand._count.products}
								countLabel="PRODUCTS"
								variant="accent"
								containImage={true}
							/>
						))}
					</div>
				)}
			</section>
		</main>
	);
}
