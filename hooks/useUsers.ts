import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { User, Role } from "@prisma/client";

interface UseUsersParams {
	page?: number;
	limit?: number;
	search?: string;
	role?: Role | "";
}

interface UsersResponse {
	data: User[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
	};
}

export function useUsers(params: UseUsersParams) {
	return useQuery({
		queryKey: ["users", params],
		queryFn: async () => {
			const { data } = await api.get<UsersResponse>("/users", {
				params,
			});
			return data;
		},
	});
}
