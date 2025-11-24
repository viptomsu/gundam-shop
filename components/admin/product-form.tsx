"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { productSchema, ProductFormValues } from "@/schemas/product";
import api from "@/lib/axios";

interface ProductFormProps {
	initialData?: ProductFormValues & { id: string };
}

export function ProductForm({ initialData }: ProductFormProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

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
		},
	});

	const onSubmit = async (data: ProductFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await api.put(`/products/${initialData.id}`, data);
			} else {
				await api.post("/products", data);
			}
			router.refresh();
			router.push("/admin/products");
			toast.success(initialData ? "Product updated" : "Product created");
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setLoading(false);
		}
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
										disabled={loading}
										onChange={(urls) => field.onChange(urls)}
										onRemove={(url) =>
											field.onChange(
												field.value.filter((current) => current !== url)
											)
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
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
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											type="number"
											disabled={loading}
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
											disabled={loading}
											placeholder="10"
											{...field}
										/>
									</FormControl>
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
									<Input
										disabled={loading}
										placeholder="Product description"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</div>
	);
}
