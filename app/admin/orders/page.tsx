"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";
import api from "@/lib/axios";
import { useUrlParams } from "@/hooks/use-url-params";
import { formatCurrency, formatDateTime } from "@/utils/format";
import {
	Order,
	OrderItem,
	OrderStatus,
	PaymentStatus,
	User,
	ProductVariant,
	Product,
} from "@prisma/client";
import { SearchInput } from "@/components/ui/search-input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

// Order type with relations
type OrderWithRelations = Order & {
	user: Pick<User, "id" | "name" | "email"> | null;
	orderItems: (OrderItem & {
		variant: Pick<ProductVariant, "id" | "name" | "image"> & {
			product: Pick<Product, "id" | "name" | "slug" | "images">;
		};
	})[];
};

interface OrderParams {
	page: number;
	limit: number;
	search: string;
	status?: OrderStatus;
}

// Status badge color mapping
const orderStatusConfig: Record<
	OrderStatus,
	{ label: string; color: "warning" | "default" | "success" | "destructive" }
> = {
	PENDING: { label: "Pending", color: "warning" },
	CONFIRMED: { label: "Confirmed", color: "default" },
	SHIPPING: { label: "Shipping", color: "default" },
	DELIVERED: { label: "Delivered", color: "success" },
	CANCELLED: { label: "Cancelled", color: "destructive" },
};

const paymentStatusConfig: Record<
	PaymentStatus,
	{ label: string; color: "success" | "default" | "destructive" }
> = {
	PENDING: { label: "Pending", color: "default" },
	PAID: { label: "Paid", color: "success" },
	FAILED: { label: "Failed", color: "destructive" },
};

export default function OrdersPage() {
	const [params, setParams] = useUrlParams<OrderParams>({
		page: 1,
		limit: 10,
		search: "",
		status: undefined,
	});

	const { data, isLoading } = useQuery({
		queryKey: ["admin-orders", params],
		queryFn: async () => {
			const res = await api.get(`/admin/orders`, {
				params,
			});
			return res.data;
		},
	});

	const columns: ColumnDef<OrderWithRelations>[] = [
		{
			accessorKey: "orderNumber",
			header: "Order ID",
			cell: ({ row }) => {
				return (
					<span className="font-mono text-sm">{row.original.orderNumber}</span>
				);
			},
		},
		{
			id: "customer",
			header: "Customer",
			cell: ({ row }) => {
				const user = row.original.user;
				const guestName = row.original.guestName;
				const guestEmail = row.original.guestEmail;

				return (
					<div className="flex flex-col text-sm">
						<span className="font-medium">
							{user?.name || guestName || "Guest"}
						</span>
						<span className="text-muted-foreground text-xs">
							{user?.email || guestEmail}
						</span>
					</div>
				);
			},
		},
		{
			accessorKey: "totalAmount",
			header: "Total",
			cell: ({ row }) => {
				return (
					<span className="font-medium">
						{formatCurrency(Number(row.original.totalAmount))}
					</span>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.original.status;
				const config = orderStatusConfig[status];
				return (
					<Badge variant="outline" color={config.color}>
						{config.label}
					</Badge>
				);
			},
		},
		{
			accessorKey: "paymentStatus",
			header: "Payment",
			cell: ({ row }) => {
				const status = row.original.paymentStatus;
				const config = paymentStatusConfig[status];
				return (
					<Badge variant="outline" color={config.color}>
						{config.label}
					</Badge>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Date",
			cell: ({ row }) => {
				return (
					<span className="text-sm text-muted-foreground">
						{formatDateTime(row.original.createdAt)}
					</span>
				);
			},
		},
		{
			id: "actions",
			header: "Actions",
			meta: {
				className: "w-20 text-center",
			},
			cell: ({ row }) => {
				return (
					<Button variant="ghost" size="icon" asChild>
						<Link href={`/admin/orders/${row.original.id}`}>
							<Eye className="h-4 w-4" />
						</Link>
					</Button>
				);
			},
		},
	];

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">Orders</h2>
			</div>

			<div className="flex flex-wrap gap-4">
				<div className="w-full md:w-64">
					<SearchInput placeholder="Search order number..." />
				</div>
				<Select
					value={params.status || "ALL"}
					onValueChange={(value) =>
						setParams((prev) => ({
							...prev,
							status: value === "ALL" ? undefined : (value as OrderStatus),
							page: 1,
						}))
					}>
					<SelectTrigger className="w-full md:w-40">
						<SelectValue placeholder="Filter by Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">All Status</SelectItem>
						<SelectItem value="PENDING">Pending</SelectItem>
						<SelectItem value="CONFIRMED">Confirmed</SelectItem>
						<SelectItem value="SHIPPING">Shipping</SelectItem>
						<SelectItem value="DELIVERED">Delivered</SelectItem>
						<SelectItem value="CANCELLED">Cancelled</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<DataTable
				columns={columns}
				data={(data?.data as OrderWithRelations[]) || []}
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
