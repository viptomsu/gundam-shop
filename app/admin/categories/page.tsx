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
import { formatDate } from "@/utils/format";
import { Category } from "@prisma/client";
import { SearchInput } from "@/components/ui/search-input";

export default function CategoriesPage() {
	const [params, setParams] = useUrlParams({
		page: 1,
		limit: 10,
		search: "",
	});
	const confirm = useConfirm();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ["categories", params],
		queryFn: async () => {
			const res = await api.get(`/categories`, {
				params,
			});
			return res.data;
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`/categories/${id}`);
		},
		onSuccess: () => {
			toast.success("Category deleted");
			queryClient.invalidateQueries({ queryKey: ["categories"] });
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

	const columns: ColumnDef<Category>[] = [
		{
			accessorKey: "name",
			header: "Name",
		},
		{
			accessorKey: "description",
			header: "Description",
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
							<Link href={`/admin/categories/${row.original.id}`}>
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
				<h2 className="text-3xl font-bold tracking-tight">Categories</h2>
				<Button asChild>
					<Link href="/admin/categories/create">
						<Plus className="mr-2 h-4 w-4" /> Add New
					</Link>
				</Button>
			</div>

			<div className="flex items-center gap-4">
				<SearchInput placeholder="Search categories..." />
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
