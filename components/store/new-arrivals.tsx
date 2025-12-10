import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product, ProductVariant } from "@prisma/client";
import { fetchApi } from "@/lib/api";

type ProductWithDetails = Product & {
	variants: ProductVariant[];
};

export async function NewArrivals() {
	let newArrivals: ProductWithDetails[] = [];

	try {
		newArrivals = await fetchApi<ProductWithDetails[]>(
			"/api/products/new-arrivals",
			{
				next: { revalidate: 60 }, // Cache for 60 seconds
			}
		);
	} catch (error) {
		console.error("Failed to fetch new arrivals:", error);
	}

	return (
		<section className="container px-4 md:px-6 py-12 border-t border-border/50">
			<div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
				<div>
					<h2 className="text-3xl font-bold tracking-tighter font-display uppercase">
						New <span className="text-primary">Arrivals</span>
					</h2>
					<p className="text-muted-foreground mt-2">
						The latest mobile suits deployed to our hangar.
					</p>
				</div>
				<Button variant="ghost" className="group gap-2" asChild>
					<Link href="/products">
						View All{" "}
						<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
					</Link>
				</Button>
			</div>

			{newArrivals.length === 0 ? (
				<div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed border-border bg-secondary/10">
					<p className="text-muted-foreground">
						No products found in the database.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{newArrivals.map((product) => {
						// Get the base price from the first variant or default to 0
						const basePrice = product.variants[0]?.price
							? Number(product.variants[0].price)
							: 0;

						// Get image from product or first variant
						const image =
							product.images[0] || product.variants[0]?.image || undefined;

						return (
							<ProductCard
								key={product.id}
								id={product.id}
								name={product.name}
								slug={product.slug}
								price={basePrice}
								image={image}
								grade={product.grade || undefined}
								isNew={true}
							/>
						);
					})}
				</div>
			)}
		</section>
	);
}
