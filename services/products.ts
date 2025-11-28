import { fetchApi } from "@/lib/api";
import { Product, ProductVariant, Category, Brand } from "@prisma/client";

export const getProduct = async (
	id: string
): Promise<
	| (Product & {
			variants: ProductVariant[];
			categories: Category[];
			brand: Brand;
	  })
	| null
> => {
	try {
		return await fetchApi<
			Product & {
				variants: ProductVariant[];
				categories: Category[];
				brand: Brand;
			}
		>(`/api/products/${id}`, {
			cache: "no-store",
		});
	} catch (error) {
		console.error("Failed to fetch product:", error);
		return null;
	}
};
