import { fetchApi } from "@/lib/api";
import { Product } from "@prisma/client";

export const getProduct = async (id: string): Promise<Product | null> => {
	try {
		return await fetchApi<Product>(`/api/products/${id}`, {
			cache: "no-store",
		});
	} catch (error) {
		console.error("Failed to fetch product:", error);
		return null;
	}
};
