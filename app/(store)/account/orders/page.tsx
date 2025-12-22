"use client";

import { useState } from "react";
import { Package, RefreshCw, AlertCircle } from "lucide-react";
import {
	useOrders,
	useCancelOrder,
	type OrderWithItems,
} from "@/hooks/queries/use-orders";
import { OrderCard } from "@/components/store/account/order-card";
import { OrderDetailDialog } from "@/components/store/account/order-detail-dialog";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";

export default function OrdersPage() {
	const { data: orders, isLoading, error, refetch } = useOrders();
	const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();
	const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
		null
	);
	const [cancelDialogOrder, setCancelDialogOrder] =
		useState<OrderWithItems | null>(null);

	const handleViewDetails = (order: OrderWithItems) => {
		setSelectedOrder(order);
	};

	const handleCancelClick = (orderId: string) => {
		const order = orders?.find((o) => o.id === orderId);
		if (order) {
			setCancelDialogOrder(order);
		}
	};

	const handleConfirmCancel = () => {
		if (cancelDialogOrder) {
			cancelOrder(cancelDialogOrder.id, {
				onSuccess: () => {
					setCancelDialogOrder(null);
				},
			});
		}
	};

	// Loading State
	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<div className="h-8 w-48 bg-card/50 animate-pulse" />
					<div className="h-10 w-24 bg-card/50 animate-pulse" />
				</div>
				{[1, 2, 3].map((i) => (
					<div key={i} className="h-40 bg-card/50 animate-pulse" />
				))}
			</div>
		);
	}

	// Error State
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="w-16 h-16 bg-destructive/10 border border-destructive/30 flex items-center justify-center mb-4">
					<AlertCircle className="h-8 w-8 text-destructive" />
				</div>
				<h2 className="text-xl font-bold mb-2">Failed to Load Orders</h2>
				<p className="text-muted-foreground mb-4">
					An error occurred while fetching your orders.
				</p>
				<Button onClick={() => refetch()} variant="outline">
					<RefreshCw className="h-4 w-4 mr-2" />
					Try Again
				</Button>
			</div>
		);
	}

	// Empty State
	if (!orders || orders.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-16 text-center">
				<div className="w-20 h-20 bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 clip-mecha">
					<Package className="h-10 w-10 text-primary" />
				</div>
				<h2 className="text-xl font-bold mb-2">No Orders Yet</h2>
				<p className="text-muted-foreground mb-4 max-w-sm">
					You haven&apos;t placed any orders yet. Start shopping to see your
					orders here!
				</p>
				<Button asChild>
					<a href="/products">Browse Products</a>
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-2xl font-bold flex items-center gap-2">
						<Package className="h-6 w-6 text-primary" />
						My Orders
					</h1>
					<p className="text-sm text-muted-foreground mt-1 font-mono">
						{orders.length} {orders.length === 1 ? "order" : "orders"} found
					</p>
				</div>
				<Button variant="ghost" size="sm" onClick={() => refetch()}>
					<RefreshCw className="h-4 w-4 mr-2" />
					Refresh
				</Button>
			</div>

			{/* Orders List */}
			<div className="space-y-4">
				{orders.map((order) => (
					<OrderCard
						key={order.id}
						order={order}
						onViewDetails={handleViewDetails}
						onCancelOrder={handleCancelClick}
						isCancelling={isCancelling && cancelDialogOrder?.id === order.id}
					/>
				))}
			</div>

			{/* Order Detail Dialog */}
			<OrderDetailDialog
				order={selectedOrder}
				open={!!selectedOrder}
				onOpenChange={(open) => !open && setSelectedOrder(null)}
			/>

			{/* Cancel Confirmation Dialog */}
			<Dialog
				open={!!cancelDialogOrder}
				onOpenChange={(open) => !open && setCancelDialogOrder(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-destructive">
							<AlertCircle className="h-5 w-5" />
							Cancel Order
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to cancel order{" "}
							<span className="font-mono text-foreground">
								{cancelDialogOrder?.orderNumber}
							</span>
							? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="ghost"
							onClick={() => setCancelDialogOrder(null)}
							disabled={isCancelling}>
							Keep Order
						</Button>
						<Button
							variant="default"
							color="destructive"
							onClick={handleConfirmCancel}
							disabled={isCancelling}>
							{isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
