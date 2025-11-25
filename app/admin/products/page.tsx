"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useUrlParams } from "@/hooks/use-url-params";
import { useConfirm } from "@/hooks/use-confirm";
import { formatCurrency, formatDate } from "@/utils/format";
import { Product, Brand, Category } from "@prisma/client";
import { SearchInput } from "@/components/ui/search-input";
import { FilterSelect } from "@/components/ui/filter-select";
import { Badge } from "@/components/ui/badge";

type ProductWithCategories = Product & { categories: Category[] };

export default function ProductsPage() {
	const [params, setParams] = useUrlParams({
		page: 1,
		limit: 10,
		search: "",
		brandId: "",
		categoryId: "",
	});
	const confirm = useConfirm();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ["products", params],
		queryFn: async () => {
			const res = await api.get(`/products`, {
				params,
			});
			return res.data;
		},
	});

	const { data: brands } = useQuery({
		queryKey: ["brands-list"],
		queryFn: async () => {
			const res = await api.get("/brands?limit=100");
			return res.data.data as Brand[];
		},
	});

	const { data: categories } = useQuery({
		queryKey: ["categories-list"],
		queryFn: async () => {
			const res = await api.get("/categories?limit=100");
			return res.data.data as Category[];
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`/products/${id}`);
		},
		onSuccess: () => {
			toast.success("Product deleted");
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
		onError: () => {
			toast.error("Something went wrong");
		},
	});

	const handleDelete = async (id: string) => {
		const ok = await confirm();
		if (ok) {
			deleteMutation.mutate(id);
		}
	};

	const columns: ColumnDef<ProductWithCategories>[] = [
		{
			accessorKey: "images",
			header: "Image",
			cell: ({ row }) => {
				const images = row.getValue("images") as string[];
				const image = images?.[0];
				return (
					<div className="relative h-10 w-10 overflow-hidden rounded-md border">
						{image ? (
							<Image
								src={image}
								alt={row.getValue("name")}
								fill
								className="object-cover"
							/>
						) : (
							<div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">
								No img
							</div>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "categories",
			header: "Categories",
			cell: ({ row }) => {
				const categories = row.original.categories as Category[];
				return (
					<div className="flex flex-wrap gap-1">
						{categories?.map((c) => (
							<Badge
								key={c.id}
								variant="outline"
								className="text-xs border-primary/50 text-primary bg-primary/5 rounded-none clip-mecha-sm">
								{c.name}
							</Badge>
						))}
					</div>
				);
			},
		},
		{
			accessorKey: "price",
			header: "Price",
			cell: ({ row }) => {
				return (
					<div className="font-mono">
						{formatCurrency(row.getValue("price"))}
					</div>
				);
			},
		},
		{
			accessorKey: "stock",
			header: "Stock",
			cell: ({ row }) => {
				return <div className="font-mono">{row.getValue("stock")}</div>;
			},
		},
		{
			accessorKey: "createdAt",
			header: "Date",
			cell: ({ row }) => {
				return formatDate(row.getValue("createdAt"));
			},
		},
		{
			id: "actions",
			header: "Actions",
			meta: {
				className: "w-25",
			},
			cell: ({ row }) => {
				return (
					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" asChild>
							<Link href={`/admin/products/${row.original.id}`}>
								<Pencil className="h-4 w-4" />
							</Link>
						</Button>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => handleDelete(row.original.id)}>
							<Trash className="h-4 w-4" />
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Products</h2>
				<Button asChild>
					<Link href="/admin/products/create">
						<Plus className="mr-2 h-4 w-4" /> Add New
					</Link>
				</Button>
			</div>

			<div className="flex items-center gap-4">
				<SearchInput placeholder="Search products..." />
				<FilterSelect
					paramName="brandId"
					placeholder="Filter by Brand"
					options={brands?.map((b) => ({ label: b.name, value: b.id })) || []}
				/>
				<FilterSelect
					paramName="categoryId"
					placeholder="Filter by Category"
					options={
						categories?.map((c) => ({ label: c.name, value: c.id })) || []
					}
				/>
			</div>

			<DataTable
				columns={columns}
				data={(data?.data as ProductWithCategories[]) || []}
				isLoading={isLoading}
				loadingRows={params.limit}
			/>
			{data?.meta && (
				<Pagination
					meta={data.meta}
					limit={params.limit}
					onChange={(newParams) => {
						setParams((prev) => ({ ...prev, ...newParams }));
					}}
				/>
			)}
		</div>
	);
}
