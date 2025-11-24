"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { Editor } from "@/components/ui/editor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { productSchema, ProductFormValues } from "@/schemas/product";
import api from "@/lib/axios";
import { getErrorMessage } from "@/utils/error";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Brand } from "@prisma/client";

interface ProductFormProps {
	initialData?: ProductFormValues & { id: string };
}

export function ProductForm({ initialData }: ProductFormProps) {
	const router = useRouter();

	const title = initialData ? "Edit Product" : "Create Product";
	const description = initialData ? "Edit a product" : "Add a new product";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema) as any,
		defaultValues: initialData || {
			name: "",
			description: "",
			price: 0,
			stock: 0,
			images: [],
			brandId: "",
		},
	});

	const queryClient = useQueryClient();

	const { data: brands } = useQuery({
		queryKey: ["brands-list"],
		queryFn: async () => {
			const res = await api.get("/brands?limit=100"); // Fetch all brands (or enough for dropdown)
			return res.data.data as Brand[];
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: ProductFormValues) => {
			if (initialData) {
				await api.put(`/products/${initialData.id}`, data);
			} else {
				await api.post("/products", data);
			}
		},
		onSuccess: () => {
			router.refresh();
			router.push("/admin/products");
			toast.success(initialData ? "Product updated" : "Product created");
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});

	const onSubmit = (data: ProductFormValues) => {
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
					<FormField
						control={form.control}
						name="images"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Images</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value.map((image) => image)}
										disabled={mutation.isPending}
										onChange={(urls) => field.onChange(urls)}
										onRemove={(url) =>
											field.onChange(
												field.value.filter((current) => current !== url)
											)
										}
										folder="gundam/products"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
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
												placeholder="Product name"
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
											<Editor
												{...field}
												onChange={(value) => field.onChange(value)}
												disabled={mutation.isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="space-y-8">
							<FormField
								control={form.control}
								name="brandId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Brand</FormLabel>
										<Select
											disabled={mutation.isPending}
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a brand" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{brands?.map((brand) => (
													<SelectItem key={brand.id} value={brand.id}>
														{brand.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type="number"
												disabled={mutation.isPending}
												placeholder="9.99"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="stock"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Stock</FormLabel>
										<FormControl>
											<Input
												type="number"
												disabled={mutation.isPending}
												placeholder="10"
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
