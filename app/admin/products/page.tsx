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
import { Product } from "@prisma/client";

export default function ProductsPage() {
	const [params, setParams] = useUrlParams({ page: 1, limit: 10 });
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

	const columns: ColumnDef<Product>[] = [
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
			accessorKey: "price",
			header: "Price",
			cell: ({ row }) => {
				return <div>{formatCurrency(row.getValue("price"))}</div>;
			},
		},
		{
			accessorKey: "stock",
			header: "Stock",
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

			<DataTable
				columns={columns}
				data={data?.data || []}
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
