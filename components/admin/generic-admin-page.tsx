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
import { SearchInput } from "@/components/ui/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/utils/format";

interface GenericAdminPageProps<T> {
	title: string;
	queryKey: string;
	apiUrl: string;
	columns?: ColumnDef<T>[];
	searchPlaceholder?: string;
	newLink: string;
	// Config for auto-generated columns
	imageKey?: string;
	nameKey?: string;
	descriptionKey?: string;
	slugKey?: string;
	dateKey?: string;
	editPath?: string; // Base path for edit link, e.g. "/admin/brands"
}

export function GenericAdminPage<T extends { id: string }>({
	title,
	queryKey,
	apiUrl,
	columns: customColumns,
	searchPlaceholder = "Search...",
	newLink,
	imageKey = "image",
	nameKey = "name",
	descriptionKey = "description",
	slugKey = "slug",
	dateKey = "createdAt",
	editPath,
}: GenericAdminPageProps<T>) {
	const [params, setParams] = useUrlParams({ page: 1, limit: 10, search: "" });
	const confirm = useConfirm();
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: [queryKey, params],
		queryFn: async () => {
			const res = await api.get(apiUrl, {
				params,
			});
			return res.data;
		},
	});

	const deleteMutation = useMutation({
		mutationFn: async (id: string) => {
			await api.delete(`${apiUrl}/${id}`);
		},
		onSuccess: () => {
			toast.success("Item deleted");
			queryClient.invalidateQueries({ queryKey: [queryKey] });
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

	const defaultColumns: ColumnDef<T>[] = [
		{
			accessorKey: imageKey,
			header: "Image",
			cell: ({ row }) => {
				const image = row.getValue(imageKey) as string;
				const name = row.getValue(nameKey) as string;
				return (
					<Avatar className="h-9 w-9 rounded-md border">
						<AvatarImage src={image} alt={name} />
						<AvatarFallback className="rounded-md">
							{name?.[0]?.toUpperCase()}
						</AvatarFallback>
					</Avatar>
				);
			},
		},
		{
			accessorKey: nameKey,
			header: "Name",
		},
		{
			accessorKey: slugKey,
			header: "Slug",
		},
		{
			accessorKey: descriptionKey,
			header: "Description",
			cell: ({ row }) => {
				const description = row.getValue(descriptionKey) as string;
				return (
					<div
						className="max-w-[300px] truncate"
						dangerouslySetInnerHTML={{ __html: description || "-" }}
					/>
				);
			},
		},
		{
			accessorKey: dateKey,
			header: "Date",
			cell: ({ row }) => {
				return formatDate(row.getValue(dateKey));
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
						{editPath && (
							<Button variant="ghost" size="icon" asChild>
								<Link href={`${editPath}/${row.original.id}`}>
									<Pencil className="h-4 w-4" />
								</Link>
							</Button>
						)}
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

	const columns = customColumns || defaultColumns;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">{title}</h2>
				<Button asChild>
					<Link href={newLink}>
						<Plus className="mr-2 h-4 w-4" /> Add New
					</Link>
				</Button>
			</div>

			<div className="flex items-center gap-4">
				<SearchInput placeholder={searchPlaceholder} />
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
