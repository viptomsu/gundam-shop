import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Series } from "@prisma/client";

export function useSeries() {
	return useQuery({
		queryKey: ["series-list"],
		queryFn: async () => {
			const res = await api.get("/series?limit=100");
			return res.data.data as Series[];
		},
	});
}
