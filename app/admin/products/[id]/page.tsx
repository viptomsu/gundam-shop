import { ProductForm } from "@/components/admin/product-form";
import { getProduct } from "@/services/products";

export default async function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const product = await getProduct(id);

	if (!product) {
		return <div>Product not found</div>;
	}

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 p-8 pt-6">
				<ProductForm
					initialData={{
						...product,
						brandId: product.brandId ?? undefined,
					}}
				/>
			</div>
		</div>
	);
}
