"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { categorySchema, CategoryFormValues } from "@/schemas/category";
import api from "@/lib/axios";
import { getErrorMessage } from "@/utils/error";
import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
	initialData?: CategoryFormValues & { id: string };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
	const router = useRouter();

	const title = initialData ? "Edit Category" : "Create Category";
	const description = initialData ? "Edit a category" : "Add a new category";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categorySchema),
		defaultValues: initialData || {
			name: "",
			description: "",
		},
	});

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: async (data: CategoryFormValues) => {
			if (initialData) {
				await api.put(`/categories/${initialData.id}`, data);
			} else {
				await api.post("/categories", data);
			}
		},
		onSuccess: () => {
			router.refresh();
			router.push("/admin/categories");
			toast.success(initialData ? "Category updated" : "Category created");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});

	const onSubmit = (data: CategoryFormValues) => {
		mutation.mutate(data);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">{title}</h2>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full">
					<div className="grid gap-8 md:grid-cols-3">
						<div className="md:col-span-2 space-y-8">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												disabled={mutation.isPending}
												placeholder="Category name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												disabled={mutation.isPending}
												placeholder="Category description"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<Button
						disabled={mutation.isPending}
						className="ml-auto"
						type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</div>
	);
}
