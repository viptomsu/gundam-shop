"use client";

import Image from "next/image";
import { format } from "date-fns";
import { Eye, XCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { orderStatusConfig, formatCurrency } from "@/lib/order-config";
import type { OrderWithItems } from "@/hooks/queries/use-orders";

interface OrderCardProps {
	order: OrderWithItems;
	onViewDetails: (order: OrderWithItems) => void;
	onCancelOrder: (orderId: string) => void;
	isCancelling?: boolean;
}

export function OrderCard({
	order,
	onViewDetails,
	onCancelOrder,
	isCancelling,
}: OrderCardProps) {
	const status = orderStatusConfig[order.status];
	const itemCount = order.orderItems.reduce(
		(sum, item) => sum + item.quantity,
		0
	);
	const displayImages = order.orderItems.slice(0, 3);

	return (
		<div className="border border-border/50 bg-card/30 hover:bg-card/50 transition-colors overflow-hidden group">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-border/30 bg-secondary/20">
				<div className="flex items-center gap-3 text-sm">
					<span className="font-mono text-muted-foreground">
						{format(new Date(order.createdAt), "dd/MM/yyyy")}
					</span>
					<span className="text-muted-foreground">•</span>
					<span className="font-mono text-primary">{order.orderNumber}</span>
				</div>
				<Badge
					variant={status.variant}
					className={cn("font-mono text-xs", status.className)}>
					{status.label}
				</Badge>
			</div>

			{/* Body */}
			<div className="p-4">
				<div className="flex gap-4">
					{/* Product Thumbnails */}
					<div className="flex -space-x-3">
						{displayImages.map((item, index) => {
							const imageSrc =
								item.variant.image ||
								item.variant.product.images[0] ||
								"/placeholder.jpg";
							return (
								<div
									key={item.id}
									className="relative w-12 h-12 border border-border bg-secondary flex items-center justify-center overflow-hidden"
									style={{ zIndex: displayImages.length - index }}>
									<Image
										src={imageSrc}
										alt={item.variant.product.name}
										fill
										className="object-cover"
									/>
								</div>
							);
						})}
						{order.orderItems.length > 3 && (
							<div className="relative w-12 h-12 border border-border bg-secondary flex items-center justify-center text-xs font-mono text-muted-foreground">
								+{order.orderItems.length - 3}
							</div>
						)}
					</div>

					{/* Order Info */}
					<div className="flex-1 min-w-0">
						<p className="text-sm text-muted-foreground">
							{itemCount} {itemCount === 1 ? "item" : "items"}
						</p>
						<p className="text-lg font-bold text-primary mt-1">
							{formatCurrency(order.totalAmount)}
						</p>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="flex flex-wrap items-center justify-between gap-2 p-4 border-t border-border/30 bg-secondary/10">
				<Button
					variant="ghost"
					size="sm"
					className="text-muted-foreground hover:text-foreground"
					onClick={() => onViewDetails(order)}>
					<Eye className="h-4 w-4 mr-2" />
					View Details
					<ChevronRight className="h-4 w-4 ml-1 opacity-50" />
				</Button>

				{order.status === "PENDING" && (
					<Button
						variant="default"
						size="sm"
						color="destructive"
						onClick={() => onCancelOrder(order.id)}
						disabled={isCancelling}>
						<XCircle className="h-4 w-4 mr-2" />
						{isCancelling ? "Cancelling..." : "Cancel Order"}
					</Button>
				)}
			</div>
		</div>
	);
}
