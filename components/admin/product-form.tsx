"use client";

import { useForm, useFieldArray } from "react-hook-form";
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
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { Editor } from "@/components/ui/editor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { productSchema, ProductFormValues } from "@/schemas/product";
import api from "@/lib/axios";
import { getErrorMessage } from "@/utils/error";
import { TagInput } from "@/components/ui/tag-input";
import { GradeSelect } from "@/components/admin/grade-select";
import { ScaleSelect } from "@/components/admin/scale-select";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { useBrands } from "@/hooks/queries/use-brands";
import { useSeries } from "@/hooks/queries/use-series";
import { useCategories } from "@/hooks/queries/use-categories";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
			slug: "",
			description: "",
			images: [],
			brandId: "",
			seriesId: "",
			categoryIds: [],
			grade: "",
			scale: "",
			variants: [
				{
					name: "Default",
					sku: "",
					price: 0,
					stock: 0,
					image: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "variants",
	});

	const queryClient = useQueryClient();

	const { data: brands } = useBrands();
	const { data: series } = useSeries();
	const { data: categories } = useCategories();

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

	// Auto-generate slug from name
	const name = form.watch("name");
	useEffect(() => {
		if (!initialData && name) {
			const slug = name
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/(^-|-$)+/g, "");
			form.setValue("slug", slug, { shouldValidate: true });
		}
	}, [name, initialData, form]);

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
							<div className="grid grid-cols-2 gap-4 items-start">
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
									name="slug"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Slug</FormLabel>
											<FormControl>
												<Input
													disabled={mutation.isPending}
													placeholder="product-slug"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												Unique identifier for the product URL.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
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
								name="seriesId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Series</FormLabel>
										<Select
											disabled={mutation.isPending}
											onValueChange={field.onChange}
											value={field.value || ""}
											defaultValue={field.value || ""}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a series" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{series?.map((s) => (
													<SelectItem key={s.id} value={s.id}>
														{s.name}
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
								name="categoryIds"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Categories</FormLabel>
										<FormControl>
											<TagInput
												placeholder="Select categories..."
												options={
													categories?.map((c) => ({
														label: c.name,
														value: c.id,
													})) || []
												}
												value={field.value || []}
												onChange={field.onChange}
												disabled={mutation.isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="grade"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Grade</FormLabel>
											<FormControl>
												<GradeSelect
													value={field.value || ""}
													onChange={field.onChange}
													disabled={mutation.isPending}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="scale"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Scale</FormLabel>
											<FormControl>
												<ScaleSelect
													value={field.value || ""}
													onChange={field.onChange}
													disabled={mutation.isPending}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>

					<Separator />

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium">Product Variants</h3>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									append({
										name: "New Variant",
										sku: "",
										price: 0,
										stock: 0,
										image: "",
									})
								}>
								<Plus className="mr-2 h-4 w-4" />
								Add Variant
							</Button>
						</div>
						<div className="space-y-4">
							{fields.map((field, index) => (
								<Card key={field.id}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											Variant {index + 1}
										</CardTitle>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => remove(index)}
											disabled={fields.length === 1}>
											<Trash className="h-4 w-4 text-destructive" />
										</Button>
									</CardHeader>
									<CardContent className="grid gap-4 md:grid-cols-5">
										<FormField
											control={form.control}
											name={`variants.${index}.name`}
											render={({ field }) => (
												<FormItem className="md:col-span-2">
													<FormLabel>Name</FormLabel>
													<FormControl>
														<Input
															disabled={mutation.isPending}
															placeholder="Variant Name"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`variants.${index}.sku`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>SKU</FormLabel>
													<FormControl>
														<Input
															disabled={mutation.isPending}
															placeholder="SKU"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`variants.${index}.price`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Price</FormLabel>
													<FormControl>
														<Input
															type="number"
															disabled={mutation.isPending}
															placeholder="0.00"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`variants.${index}.stock`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Stock</FormLabel>
													<FormControl>
														<Input
															type="number"
															disabled={mutation.isPending}
															placeholder="0"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name={`variants.${index}.image`}
											render={({ field }) => (
												<FormItem className="md:col-span-5">
													<FormLabel>Variant Image</FormLabel>
													<FormControl>
														<ImageUpload
															value={field.value ? [field.value] : []}
															disabled={mutation.isPending}
															onChange={(urls) =>
																field.onChange(urls[urls.length - 1])
															}
															onRemove={() => field.onChange("")}
															folder="gundam/variants"
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</CardContent>
								</Card>
							))}
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
