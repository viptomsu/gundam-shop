"use client";

import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import {
	Package,
	MapPin,
	CreditCard,
	Phone,
	Mail,
	User,
	FileText,
	Truck,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
	orderStatusConfig,
	paymentStatusConfig,
	paymentMethodLabels,
	formatCurrency,
} from "@/lib/order-config";
import type { OrderWithItems } from "@/hooks/queries/use-orders";

interface OrderDetailDialogProps {
	order: OrderWithItems | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({
	order,
	open,
	onOpenChange,
}: OrderDetailDialogProps) {
	if (!order) return null;

	const status = orderStatusConfig[order.status];
	const paymentStatus = paymentStatusConfig[order.paymentStatus];

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
				<DialogHeader className="p-6 pb-4 border-b border-border/30 bg-secondary/20">
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="flex items-center gap-2">
								<DialogTitle className="flex items-center gap-2 text-lg">
									<Package className="h-5 w-5 text-primary" />
									Order {order.orderNumber}
								</DialogTitle>
								<Badge
									variant="outline"
									className={cn("font-mono", status.className)}>
									{status.label}
								</Badge>
							</div>
							<DialogDescription className="mt-1 font-mono text-xs">
								Placed on {format(new Date(order.createdAt), "PPP 'at' p")}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<ScrollArea className="max-h-[calc(90vh-200px)]">
					<div className="p-6 space-y-6">
						{/* Order Items */}
						<section>
							<h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Items ({order.orderItems.length})
							</h3>
							<div className="space-y-3">
								{order.orderItems.map((item) => {
									const imageSrc =
										item.variant.image ||
										item.variant.product.images[0] ||
										"/placeholder.jpg";
									const hasDiscount =
										Number(item.originalPrice) > Number(item.price);

									return (
										<div
											key={item.id}
											className="flex gap-4 p-3 border border-border/30 bg-card/20">
											<div className="relative w-16 h-16 border border-border bg-secondary shrink-0 overflow-hidden">
												<Image
													src={imageSrc}
													alt={item.variant.product.name}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<Link
													href={`/products/${item.variant.product.slug}`}
													className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
													{item.variant.product.name}
												</Link>
												<p className="text-xs text-muted-foreground mt-0.5">
													Variant: {item.variant.name}
												</p>
												<div className="flex items-center gap-2 mt-2">
													<span className="text-sm font-mono">
														x{item.quantity}
													</span>
													<span className="text-muted-foreground">•</span>
													<span className="text-sm font-medium text-primary">
														{formatCurrency(item.price)}
													</span>
													{hasDiscount && (
														<span className="text-xs text-muted-foreground line-through">
															{formatCurrency(item.originalPrice)}
														</span>
													)}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</section>

						{/* Shipping Info */}
						<section>
							<h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
								<MapPin className="h-4 w-4" />
								Shipping Information
							</h3>
							<div className="p-4 border border-border/30 bg-card/20 space-y-2 text-sm">
								<div className="flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground shrink-0" />
									<span>{order.guestName}</span>
								</div>
								<div className="flex items-center gap-2">
									<Phone className="h-4 w-4 text-muted-foreground shrink-0" />
									<span>{order.guestPhone}</span>
								</div>
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground shrink-0" />
									<span>{order.guestEmail}</span>
								</div>
								<div className="flex items-start gap-2">
									<MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
									<span>{order.shippingAddress}</span>
								</div>
								{order.trackingNumber && (
									<div className="flex items-center gap-2 pt-2 border-t border-border/30 mt-2">
										<Truck className="h-4 w-4 text-muted-foreground shrink-0" />
										<span className="font-mono">
											{order.carrier}: {order.trackingNumber}
										</span>
									</div>
								)}
							</div>
						</section>

						{/* Payment Info */}
						<section>
							<h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
								<CreditCard className="h-4 w-4" />
								Payment
							</h3>
							<div className="p-4 border border-border/30 bg-card/20 space-y-3">
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Method</span>
									<span>{paymentMethodLabels[order.paymentMethod]}</span>
								</div>
								<div className="flex items-center justify-between text-sm">
									<span className="text-muted-foreground">Status</span>
									<span className={paymentStatus.className}>
										{paymentStatus.label}
									</span>
								</div>
								<div className="border-t border-border/30 pt-3 space-y-2">
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Subtotal</span>
										<span>{formatCurrency(order.subtotal)}</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-muted-foreground">Shipping</span>
										<span>{formatCurrency(order.shippingFee)}</span>
									</div>
									{Number(order.discountAmount) > 0 && (
										<div className="flex justify-between text-sm">
											<span className="text-muted-foreground">Discount</span>
											<span className="text-green-500">
												-{formatCurrency(order.discountAmount)}
											</span>
										</div>
									)}
									<div className="flex justify-between text-lg font-bold border-t border-border/30 pt-2">
										<span>Total</span>
										<span className="text-primary">
											{formatCurrency(order.totalAmount)}
										</span>
									</div>
								</div>
							</div>
						</section>

						{/* Note */}
						{order.note && (
							<section>
								<h3 className="text-sm font-medium text-muted-foreground mb-3">
									Note
								</h3>
								<p className="p-4 border border-border/30 bg-card/20 text-sm text-muted-foreground italic">
									{order.note}
								</p>
							</section>
						)}
					</div>
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}
