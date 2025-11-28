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
import { Product, Brand, Category, ProductVariant } from "@prisma/client";
import { SearchInput } from "@/components/ui/search-input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star, Archive } from "lucide-react";
import { GUNDAM_GRADES, GUNDAM_SCALES } from "@/config/constants";

import { useBrands } from "@/hooks/queries/use-brands";
import { useCategories } from "@/hooks/queries/use-categories";
import { useSeries } from "@/hooks/queries/use-series";

type ProductWithRelations = Product & {
	categories: Category[];
	variants: ProductVariant[];
	totalStock: number;
	minPrice: number;
	maxPrice: number;
	variantCount: number;
};

interface ProductParams {
	page: number;
	limit: number;
	search: string;
	brandId: string[];
	seriesId: string[];
	categoryId: string[];
	grade: string[];
	scale: string[];
	isFeatured?: boolean;
	isArchived?: boolean;
}

export default function ProductsPage() {
	const [params, setParams] = useUrlParams<ProductParams>({
		page: 1,
		limit: 10,
		search: "",
		brandId: [],
		seriesId: [],
		categoryId: [],
		grade: [],
		scale: [],
		isFeatured: undefined,
		isArchived: undefined,
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

	const { data: brands } = useBrands();
	const { data: categories } = useCategories();
	const { data: series } = useSeries();

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

	const columns: ColumnDef<ProductWithRelations>[] = [
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
							<Badge key={c.id} variant="outline">
								{c.name}
							</Badge>
						))}
					</div>
				);
			},
		},
		{
			accessorKey: "variants",
			header: "Variants",
			cell: ({ row }) => {
				const { totalStock, minPrice, maxPrice, variantCount } = row.original;

				return (
					<div className="flex flex-col text-sm">
						<span className="font-medium">
							{variantCount} variant{variantCount !== 1 && "s"}
						</span>
						<span className="text-muted-foreground text-xs">
							Stock: {totalStock}
						</span>
						<span className="text-muted-foreground text-xs">
							{minPrice > 0
								? `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
								: "No price"}
						</span>
					</div>
				);
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
			accessorKey: "isFeatured",
			header: "Featured",
			cell: ({ row }) => {
				return (
					<Badge variant={row.original.isFeatured ? "default" : "secondary"}>
						{row.original.isFeatured ? "Yes" : "No"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "isArchived",
			header: "Archived",
			cell: ({ row }) => {
				return (
					<Badge
						variant={row.original.isArchived ? "destructive" : "secondary"}>
						{row.original.isArchived ? "Yes" : "No"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "rating",
			header: "Rating",
			cell: ({ row }) => {
				return (
					<div className="flex flex-col text-sm">
						<span>{row.original.rating.toFixed(1)} / 5</span>
						<span className="text-xs text-muted-foreground">
							({row.original.numReviews} reviews)
						</span>
					</div>
				);
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
							color="destructive"
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

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				<SearchInput placeholder="Search products..." />
				<MultiSelect
					placeholder="Filter by Brand"
					options={brands?.map((b) => ({ label: b.name, value: b.id })) || []}
					value={params.brandId || []}
					onValueChange={(value) =>
						setParams((prev) => ({ ...prev, brandId: value, page: 1 }))
					}
				/>
				<MultiSelect
					placeholder="Filter by Series"
					options={series?.map((s) => ({ label: s.name, value: s.id })) || []}
					value={params.seriesId || []}
					onValueChange={(value) =>
						setParams((prev) => ({ ...prev, seriesId: value, page: 1 }))
					}
				/>
				<MultiSelect
					placeholder="Filter by Category"
					options={
						categories?.map((c) => ({ label: c.name, value: c.id })) || []
					}
					value={params.categoryId || []}
					onValueChange={(value) =>
						setParams((prev) => ({ ...prev, categoryId: value, page: 1 }))
					}
				/>
				<MultiSelect
					placeholder="Filter by Grade"
					options={GUNDAM_GRADES}
					value={params.grade || []}
					onValueChange={(value) =>
						setParams((prev) => ({ ...prev, grade: value, page: 1 }))
					}
				/>
				<MultiSelect
					placeholder="Filter by Scale"
					options={GUNDAM_SCALES}
					value={params.scale || []}
					onValueChange={(value) =>
						setParams((prev) => ({ ...prev, scale: value, page: 1 }))
					}
				/>
				<div className="flex items-center gap-2">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Toggle
									variant="outline"
									aria-label="Toggle featured"
									pressed={!!params.isFeatured}
									onPressedChange={(pressed) => {
										setParams((prev) => {
											const newParams = { ...prev };
											if (pressed) {
												newParams.isFeatured = true;
											} else {
												newParams.isFeatured = undefined;
											}
											return { ...newParams, page: 1 };
										});
									}}>
									<Star
										className={`h-4 w-4 ${
											params.isFeatured ? "fill-current" : ""
										}`}
									/>
								</Toggle>
							</TooltipTrigger>
							<TooltipContent>
								<p>Filter by Featured</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Toggle
									variant="outline"
									aria-label="Toggle archived"
									pressed={!!params.isArchived}
									onPressedChange={(pressed) => {
										setParams((prev) => {
											const newParams = { ...prev };
											if (pressed) {
												newParams.isArchived = true;
											} else {
												newParams.isArchived = undefined;
											}
											return { ...newParams, page: 1 };
										});
									}}>
									<Archive className="h-4 w-4" />
								</Toggle>
							</TooltipTrigger>
							<TooltipContent>
								<p>Filter by Archived</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={(data?.data as ProductWithRelations[]) || []}
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
