import { ProductCard } from "@/components/store/product-card";
import type { Product } from "@/types/product";

interface ProductGridProps {
	products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
			{products.map((product) => {
				const basePrice =
					product.minPrice || Number(product.variants[0]?.price) || 0;
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
						variants={product.variants}
					/>
				);
			})}
		</div>
	);
}
