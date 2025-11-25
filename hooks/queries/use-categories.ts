import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Category } from "@prisma/client";

export function useCategories() {
	return useQuery({
		queryKey: ["categories-list"],
		queryFn: async () => {
			const res = await api.get("/categories?limit=100");
			return res.data.data as Category[];
		},
	});
}
