"use client";

import { CategoryForm } from "@/components/admin/category-form";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { NotFound } from "@/components/ui/not-found";

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

	if (!category) {
		return (
			<NotFound
				title="Category not found"
				description="The category you are looking for does not exist or has been deleted."
				linkText="Back to Categories"
				linkHref="/admin/categories"
			/>
		);
	}

	return (
		<div className="flex-1 space-y-4 p-8 pt-6">
			<CategoryForm initialData={category} />
		</div>
	);
}
