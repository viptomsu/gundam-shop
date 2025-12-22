"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/actions/order";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useConfirm } from "@/hooks/use-confirm";
import {
	MoreHorizontal,
	Eye,
	Clock,
	CheckCircle,
	Truck,
	PackageCheck,
	XCircle,
} from "lucide-react";

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
	const queryClient = useQueryClient();
	const confirm = useConfirm();
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

	const updateStatusMutation = useMutation({
		mutationFn: async ({
			orderId,
			newStatus,
		}: {
			orderId: string;
			newStatus: OrderStatus;
		}) => {
			return await updateOrderStatus(orderId, newStatus);
		},
		onSuccess: (result) => {
			if (result.success) {
				toast.success("Order status updated");
				queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
			} else {
				toast.error(result.message || "Failed to update status");
			}
		},
		onError: () => {
			toast.error("Failed to update status");
		},
	});

	const handleStatusChange = async (
		orderId: string,
		newStatus: OrderStatus
	) => {
		if (newStatus === "CANCELLED") {
			const ok = await confirm(
				"Cancel Order?",
				"This action will restock all items from this order back to inventory. This cannot be undone."
			);
			if (ok) {
				updateStatusMutation.mutate({ orderId, newStatus });
			}
		} else {
			updateStatusMutation.mutate({ orderId, newStatus });
		}
	};

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
				className: "w-24",
			},
			cell: ({ row }) => {
				const order = row.original;
				const isDisabled =
					order.status === "CANCELLED" || updateStatusMutation.isPending;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem asChild>
								<Link href={`/admin/orders/${order.id}`}>
									<Eye className="mr-2 h-4 w-4" /> View Details
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuLabel>Update Status</DropdownMenuLabel>
							<DropdownMenuItem
								disabled={isDisabled || order.status === "PENDING"}
								onClick={() => handleStatusChange(order.id, "PENDING")}>
								<Clock className="mr-2 h-4 w-4" /> Pending
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={isDisabled || order.status === "CONFIRMED"}
								onClick={() => handleStatusChange(order.id, "CONFIRMED")}>
								<CheckCircle className="mr-2 h-4 w-4" /> Confirmed
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={isDisabled || order.status === "SHIPPING"}
								onClick={() => handleStatusChange(order.id, "SHIPPING")}>
								<Truck className="mr-2 h-4 w-4" /> Shipping
							</DropdownMenuItem>
							<DropdownMenuItem
								disabled={isDisabled || order.status === "DELIVERED"}
								onClick={() => handleStatusChange(order.id, "DELIVERED")}>
								<PackageCheck className="mr-2 h-4 w-4" /> Delivered
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant="destructive"
								disabled={isDisabled}
								onClick={() => handleStatusChange(order.id, "CANCELLED")}>
								<XCircle className="mr-2 h-4 w-4" /> Cancel Order
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
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
