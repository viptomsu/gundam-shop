"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TagInput } from "@/components/ui/tag-input";
import api from "@/lib/axios";
import { Category } from "@prisma/client";
import { toast } from "sonner";

interface CategoryTagInputProps {
	value: string[];
	onChange: (value: string[]) => void;
	disabled?: boolean;
}

export function CategoryTagInput({
	value,
	onChange,
	disabled,
}: CategoryTagInputProps) {
	const queryClient = useQueryClient();

	const { data: categories } = useQuery({
		queryKey: ["categories-list"],
		queryFn: async () => {
			const res = await api.get("/categories?limit=100");
			return res.data.data as Category[];
		},
	});

	const createCategoryMutation = useMutation({
		mutationFn: async (name: string) => {
			const res = await api.post("/categories", { name });
			return res.data as Category;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories-list"] });
			toast.success("Category created");
		},
	});

	return (
		<TagInput
			placeholder="Select categories..."
			options={
				categories?.map((c) => ({
					label: c.name,
					value: c.id,
				})) || []
			}
			value={value || []}
			onChange={onChange}
			onCreate={async (label) => {
				const newCategory = await createCategoryMutation.mutateAsync(label);
				return {
					label: newCategory.name,
					value: newCategory.id,
				};
			}}
			disabled={disabled || createCategoryMutation.isPending}
		/>
	);
}
