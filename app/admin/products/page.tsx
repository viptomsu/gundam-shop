"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useUrlParams } from "@/hooks/use-url-params";
import { useConfirm } from "@/hooks/use-confirm";
import { formatCurrency, formatDate } from "@/utils/format";

type Product = {
	id: string;
	name: string;
	price: number;
	stock: number;
	createdAt: string;
};

export default function ProductsPage() {
	const { getParam, setParam } = useUrlParams();
	const page = parseInt(getParam("page") || "1");
	const confirm = useConfirm();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ["products", page],
		queryFn: async () => {
			const res = await api.get(`/products?page=${page}&limit=10`);
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

			{isLoading ? (
				<div>Loading...</div>
			) : (
				<>
					<DataTable columns={columns} data={data?.data || []} />
					{data?.meta && (
						<Pagination
							meta={data.meta}
							onPageChange={(p) => setParam("page", p)}
						/>
					)}
				</>
			)}
		</div>
	);
}
