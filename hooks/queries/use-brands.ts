import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Brand } from "@prisma/client";

export function useBrands() {
	return useQuery({
		queryKey: ["brands-list"],
		queryFn: async () => {
			const res = await api.get("/brands?limit=100");
			return res.data.data as Brand[];
		},
	});
}
