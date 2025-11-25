"use client";

import { CategoryForm } from "@/components/admin/category-form";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditCategoryPage() {
	const params = useParams();
	const categoryId = params.id as string;

	const { data: category, isLoading } = useQuery({
		queryKey: ["category", categoryId],
		queryFn: async () => {
			const res = await api.get(`/categories/${categoryId}`);
			return res.data;
		},
	});

	if (isLoading) {
		return (
			<div className="flex-1 space-y-4 p-8 pt-6">
				<Skeleton className="h-[500px] w-full" />
			</div>
		);
	}

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<CategoryForm initialData={category} />
		</div>
	);
}
