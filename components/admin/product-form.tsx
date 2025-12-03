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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUpload } from "@/components/ui/image-upload";
import { Editor } from "@/components/ui/editor";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { productSchema, ProductFormValues } from "@/schemas/product";
import api from "@/lib/axios";
import { getErrorMessage } from "@/utils/error";
import { MultiSelect } from "@/components/ui/multi-select";
import { GradeSelect } from "@/components/admin/grade-select";
import { ScaleSelect } from "@/components/admin/scale-select";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { useBrands } from "@/hooks/queries/use-brands";
import { useSeries } from "@/hooks/queries/use-series";
import { useCategories } from "@/hooks/queries/use-categories";
import { DataSelect } from "@/components/ui/data-select";
import { useModalStore, useModal } from "@/hooks/use-modal-store";
import { ModalIds } from "@/types/modal";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ProductFormProps {
	initialData?: ProductFormValues & { id: string };
}

export function ProductForm({ initialData }: ProductFormProps) {
	const router = useRouter();
	const bulkSaleModal = useModal(ModalIds.BULK_SALE_MODAL);

	const title = initialData ? "Edit Product" : "Create Product";
	const description = initialData ? "Edit a product" : "Add a new product";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema) as any,
		defaultValues: initialData
			? {
					...initialData,
					variants: initialData.variants.map((variant) => ({
						...variant,
						saleStartDate: variant.saleStartDate
							? new Date(variant.saleStartDate)
							: undefined,
						saleEndDate: variant.saleEndDate
							? new Date(variant.saleEndDate)
							: undefined,
					})),
			  }
			: {
					name: "",
					slug: "",
					description: "",
					images: [],
					brandId: "",
					seriesId: "",
					categoryIds: [],
					grade: "",
					scale: "",
					isFeatured: false,
					isArchived: false,
					variants: [
						{
							name: "Default",
							sku: "",
							price: 0,
							stock: 0,
							image: "",
							isArchived: false,
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
										<DataSelect
											disabled={mutation.isPending}
											onValueChange={field.onChange}
											value={field.value}
											options={
												brands?.map((brand) => ({
													label: brand.name,
													value: brand.id,
												})) || []
											}
											placeholder="Select a brand"
											isLoading={!brands}
										/>
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
										<DataSelect
											disabled={mutation.isPending}
											onValueChange={field.onChange}
											value={field.value || ""}
											options={
												series?.map((s) => ({
													label: s.name,
													value: s.id,
												})) || []
											}
											placeholder="Select a series"
											isLoading={!series}
										/>
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
											<MultiSelect
												placeholder="Select categories..."
												options={
													categories?.map((c) => ({
														label: c.name,
														value: c.id,
													})) || []
												}
												value={field.value || []}
												onValueChange={field.onChange}
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

					<div className="grid gap-8 md:grid-cols-3">
						<FormField
							control={form.control}
							name="isFeatured"
							render={({ field }) => (
								<Card className="p-4">
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Featured</FormLabel>
											<FormDescription>
												This product will appear on the home page
											</FormDescription>
										</div>
									</FormItem>
								</Card>
							)}
						/>
						<FormField
							control={form.control}
							name="isArchived"
							render={({ field }) => (
								<Card className="p-4">
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												color="accent"
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Archived</FormLabel>
											<FormDescription>
												This product will not appear anywhere in the store
											</FormDescription>
										</div>
									</FormItem>
								</Card>
							)}
						/>
						{initialData && (
							<Card className="p-4" variant="sensor">
								<div className="space-y-1">
									<h4 className="text-sm font-medium leading-none">Rating</h4>
									<p className="text-sm text-muted-foreground">
										{(initialData as any).rating?.toFixed(1) || "0.0"} / 5 (
										{(initialData as any).numReviews || 0} reviews)
									</p>
								</div>
							</Card>
						)}
					</div>

					<Separator />

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="text-lg font-medium">Product Variants</h3>
							<div className="flex gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										bulkSaleModal.show({
											onConfirm: (values: any) => {
												const variants = form.getValues("variants");
												const updatedVariants = variants.map((variant) => {
													let salePrice = variant.price;
													if (values.strategy === "fixed") {
														salePrice = values.value;
													} else {
														salePrice =
															variant.price * (1 - values.value / 100);
													}

													return {
														...variant,
														salePrice: Math.max(0, salePrice),
														saleStartDate: values.startDate,
														saleEndDate: values.endDate,
													};
												});
												form.setValue("variants", updatedVariants, {
													shouldDirty: true,
													shouldTouch: true,
													shouldValidate: true,
												});
											},
										});
									}}>
									Bulk Apply Sale
								</Button>
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
											isArchived: false,
										})
									}>
									<Plus className="mr-2 h-4 w-4" />
									Add Variant
								</Button>
							</div>
						</div>
						<div className="space-y-4">
							{fields.map((field, index) => (
								<Card key={field.id}>
									<CardHeader className="flex flex-row items-center justify-between space-y-0">
										<CardTitle className="text-sm font-medium">
											<FormField
												control={form.control}
												name={`variants.${index}.name`}
												render={({ field }) => (
													<FormItem className="flex flex-row items-center gap-2">
														<FormLabel>Name</FormLabel>
														<FormControl>
															<Input
																disabled={mutation.isPending}
																placeholder="Variant name"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
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
									<CardContent className="grid gap-4 p-4 md:grid-cols-3">
										<div className="md:col-span-1">
											<FormField
												control={form.control}
												name={`variants.${index}.image`}
												render={({ field }) => (
													<FormItem>
														<FormLabel>Variant Image</FormLabel>
														<FormControl>
															<ImageUpload
																value={field.value ? [field.value] : []}
																disabled={mutation.isPending}
																onChange={(url) => field.onChange(url)}
																onRemove={() => field.onChange("")}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="grid gap-4 md:col-span-2">
											<div className="grid gap-4 md:grid-cols-3">
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
																	placeholder="Price"
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
																	placeholder="Stock"
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className="flex items-center gap-4 border p-4 rounded-md">
												<div className="flex-1">
													<div className="flex items-center space-x-2">
														<Switch
															checked={
																form.watch(`variants.${index}.salePrice`) !==
																undefined
															}
															onCheckedChange={(checked) => {
																if (!checked) {
																	form.setValue(
																		`variants.${index}.salePrice`,
																		undefined
																	);
																	form.setValue(
																		`variants.${index}.saleStartDate`,
																		undefined
																	);
																	form.setValue(
																		`variants.${index}.saleEndDate`,
																		undefined
																	);
																} else {
																	form.setValue(
																		`variants.${index}.salePrice`,
																		form.getValues(`variants.${index}.price`)
																	);
																}
															}}
														/>
														<Label>Enable Sale</Label>
													</div>
												</div>
											</div>

											{form.watch(`variants.${index}.salePrice`) !==
												undefined && (
												<div className="grid grid-cols-3 gap-4 p-4 border rounded-md bg-accent/10">
													<FormField
														control={form.control}
														name={`variants.${index}.salePrice`}
														render={({ field }) => (
															<FormItem>
																<FormLabel>Sale Price</FormLabel>
																<FormControl>
																	<Input
																		type="number"
																		disabled={mutation.isPending}
																		placeholder="Sale Price"
																		{...field}
																		value={field.value ?? ""}
																	/>
																</FormControl>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`variants.${index}.saleStartDate`}
														render={({ field }) => (
															<FormItem className="flex flex-col">
																<FormLabel>Start Date</FormLabel>
																<DateTimePicker
																	date={field.value}
																	setDate={field.onChange}
																	defaultTime={{
																		hours: 0,
																		minutes: 0,
																		seconds: 0,
																	}}
																/>
																<FormMessage />
															</FormItem>
														)}
													/>
													<FormField
														control={form.control}
														name={`variants.${index}.saleEndDate`}
														render={({ field }) => (
															<FormItem className="flex flex-col">
																<FormLabel>End Date</FormLabel>
																<DateTimePicker
																	date={field.value}
																	setDate={field.onChange}
																	defaultTime={{
																		hours: 23,
																		minutes: 59,
																		seconds: 59,
																	}}
																/>
																<FormMessage />
															</FormItem>
														)}
													/>
												</div>
											)}
										</div>
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
