import { ProductForm } from "@/components/admin/product-form";
import { getProduct } from "@/services/products";
import { NotFound } from "@/components/ui/not-found";

export default async function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const product = await getProduct(id);

	if (!product) {
		return (
			<NotFound
				title="Product not found"
				description="The product you are looking for does not exist or has been deleted."
				linkText="Back to Products"
				linkHref="/admin/products"
			/>
		);
	}

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductForm
					initialData={{
						...product,
						brandId: product.brandId ?? "",
						seriesId: product.seriesId ?? undefined,
						grade: product.grade ?? undefined,
						scale: product.scale ?? undefined,
						categoryIds: product.categories.map((c) => c.id),
						variants: product.variants.map((v) => ({
							...v,
							sku: v.sku ?? "",
							price: Number(v.price),
							salePrice: v.salePrice ? Number(v.salePrice) : undefined,
							saleStartDate: v.saleStartDate ?? undefined,
							saleEndDate: v.saleEndDate ?? undefined,
							image: v.image ?? undefined,
							isArchived: v.isArchived,
						})),
					}}
				/>
			</div>
		</div>
	);
}
