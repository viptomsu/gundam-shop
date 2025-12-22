"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
	ArrowLeft,
	Package,
	User,
	MapPin,
	CreditCard,
	Save,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingScreen } from "@/components/ui/loading-screen";

import api from "@/lib/axios";
import { formatCurrency, formatDateTime } from "@/utils/format";
import { updateOrderStatus, updatePaymentStatus } from "@/app/actions/order";
import {
	Order,
	OrderItem,
	OrderStatus,
	PaymentStatus,
	PaymentMethod,
	User as UserType,
	ProductVariant,
	Product,
} from "@prisma/client";

// Order type with relations
type OrderWithRelations = Order & {
	user: Pick<UserType, "id" | "name" | "email"> | null;
	orderItems: (OrderItem & {
		variant: Pick<ProductVariant, "id" | "name" | "image"> & {
			product: Pick<Product, "id" | "name" | "slug" | "images">;
		};
	})[];
};

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

const paymentMethodLabels: Record<PaymentMethod, string> = {
	COD: "Cash on Delivery",
	BANK_TRANSFER: "Bank Transfer",
	VNPAY: "VNPay",
};

export default function OrderDetailPage() {
	const params = useParams();
	const router = useRouter();
	const queryClient = useQueryClient();
	const orderId = params.id as string;

	const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(
		null
	);
	const [selectedPaymentStatus, setSelectedPaymentStatus] =
		useState<PaymentStatus | null>(null);
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

	const { data: order, isLoading } = useQuery<OrderWithRelations>({
		queryKey: ["admin-order", orderId],
		queryFn: async () => {
			const res = await api.get(`/admin/orders/${orderId}`);
			return res.data.data;
		},
	});

	// Initialize selected states when order loads
	useEffect(() => {
		if (order) {
			setSelectedStatus(order.status);
			setSelectedPaymentStatus(order.paymentStatus);
		}
	}, [order]);

	const updateStatusMutation = useMutation({
		mutationFn: async (newStatus: OrderStatus) => {
			return await updateOrderStatus(orderId, newStatus);
		},
		onSuccess: (result) => {
			if (result.success) {
				toast.success("Order status updated");
				queryClient.invalidateQueries({ queryKey: ["admin-order", orderId] });
				queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
			} else {
				toast.error(result.message || "Failed to update status");
			}
		},
		onError: () => {
			toast.error("Failed to update status");
		},
	});

	const updatePaymentMutation = useMutation({
		mutationFn: async (newStatus: PaymentStatus) => {
			return await updatePaymentStatus(orderId, newStatus);
		},
		onSuccess: (result) => {
			if (result.success) {
				toast.success("Payment status updated");
				queryClient.invalidateQueries({ queryKey: ["admin-order", orderId] });
				queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
			} else {
				toast.error(result.message || "Failed to update payment status");
			}
		},
		onError: () => {
			toast.error("Failed to update payment status");
		},
	});

	const handleStatusChange = (value: string) => {
		const newStatus = value as OrderStatus;
		if (newStatus === "CANCELLED") {
			setPendingStatus(newStatus);
			setShowCancelDialog(true);
		} else {
			setSelectedStatus(newStatus);
		}
	};

	const handleConfirmCancel = () => {
		if (pendingStatus) {
			setSelectedStatus(pendingStatus);
			setShowCancelDialog(false);
			setPendingStatus(null);
		}
	};

	const handleSaveChanges = () => {
		if (selectedStatus && selectedStatus !== order?.status) {
			updateStatusMutation.mutate(selectedStatus);
		}
		if (
			selectedPaymentStatus &&
			selectedPaymentStatus !== order?.paymentStatus
		) {
			updatePaymentMutation.mutate(selectedPaymentStatus);
		}
	};

	const hasChanges =
		(selectedStatus && selectedStatus !== order?.status) ||
		(selectedPaymentStatus && selectedPaymentStatus !== order?.paymentStatus);

	const isSaving =
		updateStatusMutation.isPending || updatePaymentMutation.isPending;

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (!order) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<p className="text-lg text-muted-foreground">Order not found</p>
				<Button asChild className="mt-4">
					<Link href="/admin/orders">Back to Orders</Link>
				</Button>
			</div>
		);
	}

	const statusConfig = orderStatusConfig[order.status];
	const paymentConfig = paymentStatusConfig[order.paymentStatus];

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="ghost" size="icon" asChild>
						<Link href="/admin/orders">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<h1 className="text-2xl font-bold flex items-center gap-3">
							Order {order.orderNumber}
							<Badge variant="outline" color={statusConfig.color}>
								{statusConfig.label}
							</Badge>
							<Badge variant="outline" color={paymentConfig.color}>
								{paymentConfig.label}
							</Badge>
						</h1>
						<p className="text-sm text-muted-foreground">
							Placed on {formatDateTime(order.createdAt)}
						</p>
					</div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left: Order Items */}
				<div className="lg:col-span-2 space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Package className="h-5 w-5" />
								Order Items ({order.orderItems.length})
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{order.orderItems.map((item) => {
								const itemImage =
									item.variant.image ||
									item.variant.product.images?.[0] ||
									"/placeholder.svg";
								const subtotal = Number(item.price) * item.quantity;

								return (
									<div
										key={item.id}
										className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
										<div className="relative h-20 w-20 overflow-hidden rounded-md border shrink-0">
											<Image
												src={itemImage}
												alt={item.variant.product.name}
												fill
												className="object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<Link
												href={`/products/${item.variant.product.slug}`}
												className="font-medium hover:underline line-clamp-1">
												{item.variant.product.name}
											</Link>
											<p className="text-sm text-muted-foreground">
												Variant: {item.variant.name}
											</p>
											<div className="flex items-center gap-2 mt-1 text-sm">
												<span>
													{formatCurrency(Number(item.price))} × {item.quantity}
												</span>
												{Number(item.originalPrice) > Number(item.price) && (
													<span className="text-muted-foreground line-through">
														{formatCurrency(Number(item.originalPrice))}
													</span>
												)}
											</div>
										</div>
										<div className="text-right font-medium">
											{formatCurrency(subtotal)}
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>
				</div>

				{/* Right Sidebar */}
				<div className="space-y-4">
					{/* Customer Info */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<User className="h-4 w-4" />
								Customer
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<p className="font-medium">
								{order.user?.name || order.guestName || "Guest"}
							</p>
							<p className="text-muted-foreground">{order.guestPhone}</p>
							<p className="text-muted-foreground">
								{order.user?.email || order.guestEmail}
							</p>
						</CardContent>
					</Card>

					{/* Shipping Address */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<MapPin className="h-4 w-4" />
								Shipping Address
							</CardTitle>
						</CardHeader>
						<CardContent className="text-sm">
							<p className="whitespace-pre-line">{order.shippingAddress}</p>
							{order.note && (
								<div className="mt-3 pt-3 border-t">
									<p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
										Note
									</p>
									<p>{order.note}</p>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Payment Info */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<CreditCard className="h-4 w-4" />
								Payment
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Method</span>
								<span>{paymentMethodLabels[order.paymentMethod]}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Status</span>
								<Badge variant="outline" color={paymentConfig.color}>
									{paymentConfig.label}
								</Badge>
							</div>
						</CardContent>
					</Card>

					{/* Order Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Summary</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2 text-sm">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatCurrency(Number(order.subtotal))}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-muted-foreground">Shipping</span>
								<span>{formatCurrency(Number(order.shippingFee))}</span>
							</div>
							{Number(order.discountAmount) > 0 && (
								<div className="flex justify-between text-green-500">
									<span>Discount</span>
									<span>-{formatCurrency(Number(order.discountAmount))}</span>
								</div>
							)}
							<Separator />
							<div className="flex justify-between font-bold text-lg">
								<span>Total</span>
								<span>{formatCurrency(Number(order.totalAmount))}</span>
							</div>
						</CardContent>
					</Card>

					{/* Admin Controls */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Admin Controls</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<label className="text-sm font-medium">Order Status</label>
								<Select
									value={selectedStatus || order.status}
									onValueChange={handleStatusChange}
									disabled={order.status === "CANCELLED"}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="PENDING">Pending</SelectItem>
										<SelectItem value="CONFIRMED">Confirmed</SelectItem>
										<SelectItem value="SHIPPING">Shipping</SelectItem>
										<SelectItem value="DELIVERED">Delivered</SelectItem>
										<SelectItem value="CANCELLED">Cancelled</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<label className="text-sm font-medium">Payment Status</label>
								<Select
									value={selectedPaymentStatus || order.paymentStatus}
									onValueChange={(value) =>
										setSelectedPaymentStatus(value as PaymentStatus)
									}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="PENDING">Pending</SelectItem>
										<SelectItem value="PAID">Paid</SelectItem>
										<SelectItem value="FAILED">Failed</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<Button
								className="w-full"
								onClick={handleSaveChanges}
								disabled={!hasChanges || isSaving}>
								<Save className="h-4 w-4 mr-2" />
								{isSaving ? "Saving..." : "Save Changes"}
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>

			{/* Cancel Confirmation Dialog */}
			<Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Cancel Order?</DialogTitle>
						<DialogDescription>
							This action will restock all items from this order back to
							inventory. This cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setShowCancelDialog(false);
								setPendingStatus(null);
							}}>
							Keep Order
						</Button>
						<Button color="destructive" onClick={handleConfirmCancel}>
							Yes, Cancel Order
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
