"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import {
	Search,
	Package,
	MapPin,
	Truck,
	CheckCircle,
	Clock,
	XCircle,
	ArrowLeft,
	FileText,
	CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
	orderStatusConfig,
	orderStatusTimeline,
	paymentMethodLabels,
	formatCurrency,
} from "@/lib/order-config";
import {
	trackOrder,
	type TrackedOrder,
	type TrackOrderInput,
} from "@/app/actions/tracking";
import type { OrderStatus } from "@prisma/client";

// Form validation schema
const trackingFormSchema = z.object({
	orderNumber: z.string().min(1, "Order number is required"),
	email: z.string().email("Please enter a valid email"),
});

type TrackingFormValues = z.infer<typeof trackingFormSchema>;

// Icon mapping for status timeline
const statusIcons: Record<OrderStatus, typeof Clock> = {
	PENDING: Clock,
	CONFIRMED: CheckCircle,
	SHIPPING: Truck,
	DELIVERED: Package,
	CANCELLED: XCircle,
};

export default function TrackingPage() {
	const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null);

	const form = useForm<TrackingFormValues>({
		resolver: zodResolver(trackingFormSchema),
		defaultValues: {
			orderNumber: "",
			email: "",
		},
	});

	const trackMutation = useMutation({
		mutationFn: async (data: TrackOrderInput) => {
			const result = await trackOrder(data);
			if (!result.success) {
				throw new Error(result.error || "Failed to track order");
			}
			return result.order;
		},
		onSuccess: (order) => {
			setTrackedOrder(order ?? null);
		},
	});

	const onSubmit = (values: TrackingFormValues) => {
		trackMutation.mutate(values);
	};

	const handleReset = () => {
		setTrackedOrder(null);
		form.reset();
		trackMutation.reset();
	};

	// Get status index for timeline
	const getStatusIndex = (status: string) => {
		if (status === "CANCELLED") return -1;
		return orderStatusTimeline.findIndex((s) => s === status);
	};

	return (
		<div className="container py-8 md:py-12">
			<div className="max-w-2xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/30 mb-4 clip-mecha">
						<Search className="h-8 w-8 text-primary" />
					</div>
					<h1 className="text-2xl md:text-3xl font-bold">Track Your Order</h1>
					<p className="text-muted-foreground mt-2">
						Enter your order number and email to view order details
					</p>
				</div>

				{/* Search Form */}
				{!trackedOrder && (
					<div className="border border-border/50 bg-card/30 p-6 md:p-8 clip-mecha">
						{/* Corner decorations */}
						<div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50" />
						<div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50" />
						<div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50" />
						<div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50" />

						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6">
								<FormField
									control={form.control}
									name="orderNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Order Number</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. GDM-XXXXX-XXXX"
													className="tech-input-base"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email Address</FormLabel>
											<FormControl>
												<Input
													type="email"
													placeholder="The email used for your order"
													className="tech-input-base"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/* Error message */}
								{trackMutation.error && (
									<div className="p-4 border border-destructive/50 bg-destructive/10 text-destructive text-sm flex items-center gap-2">
										<XCircle className="h-4 w-4 shrink-0" />
										{trackMutation.error.message}
									</div>
								)}

								<Button
									type="submit"
									className="w-full"
									disabled={trackMutation.isPending}>
									{trackMutation.isPending ? (
										<>
											<Clock className="h-4 w-4 mr-2 animate-spin" />
											Tracking...
										</>
									) : (
										<>
											<Search className="h-4 w-4 mr-2" />
											Track Order
										</>
									)}
								</Button>
							</form>
						</Form>
					</div>
				)}

				{/* Order Result */}
				{trackedOrder && (
					<div className="space-y-6">
						{/* Back button */}
						<Button variant="ghost" size="sm" onClick={handleReset}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Track Another Order
						</Button>

						{/* Order Header */}
						<div className="border border-border/50 bg-card/30 p-6 clip-mecha">
							<div className="flex flex-wrap items-start justify-between gap-4">
								<div>
									<h2 className="text-xl font-bold flex items-center gap-2">
										<Package className="h-5 w-5 text-primary" />
										{trackedOrder.orderNumber}
									</h2>
									<p className="text-sm text-muted-foreground font-mono mt-1">
										Placed on {format(new Date(trackedOrder.createdAt), "PPP")}
									</p>
								</div>
								<Badge
									variant={
										orderStatusConfig[trackedOrder.status as OrderStatus]
											.variant
									}
									className={cn(
										"font-mono text-sm",
										orderStatusConfig[trackedOrder.status as OrderStatus]
											.className
									)}>
									{orderStatusConfig[trackedOrder.status as OrderStatus].label}
								</Badge>
							</div>

							{/* Status Timeline */}
							{trackedOrder.status !== "CANCELLED" && (
								<div className="mt-6 pt-6 border-t border-border/30">
									<div className="flex items-center justify-between">
										{orderStatusTimeline.map((status, index) => {
											const currentIndex = getStatusIndex(trackedOrder.status);
											const isCompleted = index <= currentIndex;
											const isCurrent = index === currentIndex;
											const StatusIcon = statusIcons[status];

											return (
												<div key={status} className="flex-1 relative">
													<div className="flex flex-col items-center">
														<div
															className={cn(
																"w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
																isCompleted
																	? "bg-primary border-primary text-primary-foreground"
																	: "bg-secondary border-border text-muted-foreground"
															)}>
															<StatusIcon className="h-5 w-5" />
														</div>
														<span
															className={cn(
																"text-xs mt-2 text-center",
																isCurrent
																	? "text-primary font-medium"
																	: "text-muted-foreground"
															)}>
															{orderStatusConfig[status].label}
														</span>
													</div>
													{index < orderStatusTimeline.length - 1 && (
														<div
															className={cn(
																"absolute top-5 left-1/2 w-full h-0.5",
																index < currentIndex
																	? "bg-primary"
																	: "bg-border"
															)}
														/>
													)}
												</div>
											);
										})}
									</div>
								</div>
							)}

							{/* Cancelled Status */}
							{trackedOrder.status === "CANCELLED" && (
								<div className="mt-6 pt-6 border-t border-border/30">
									<div className="flex items-center gap-3 text-destructive">
										<XCircle className="h-5 w-5" />
										<span>This order has been cancelled</span>
									</div>
								</div>
							)}

							{/* Tracking Number */}
							{trackedOrder.trackingNumber && (
								<div className="mt-4 p-3 bg-secondary/30 border border-border/30 flex items-center gap-3">
									<Truck className="h-5 w-5 text-primary" />
									<div>
										<p className="text-xs text-muted-foreground">
											Tracking Number
										</p>
										<p className="font-mono">
											{trackedOrder.carrier}: {trackedOrder.trackingNumber}
										</p>
									</div>
								</div>
							)}
						</div>

						{/* Order Items */}
						<div className="border border-border/50 bg-card/30 p-6 clip-mecha">
							<h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Order Items ({trackedOrder.orderItems.length})
							</h3>
							<div className="space-y-3">
								{trackedOrder.orderItems.map((item) => {
									const imageSrc =
										item.variant.image ||
										item.variant.product.images[0] ||
										"/placeholder.jpg";

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
													{item.variant.name}
												</p>
												<div className="flex items-center gap-2 mt-2 text-sm">
													<span className="font-mono">x{item.quantity}</span>
													<span className="text-muted-foreground">•</span>
													<span className="text-primary font-medium">
														{formatCurrency(item.price)}
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>

						{/* Shipping & Payment */}
						<div className="grid gap-4 md:grid-cols-2">
							{/* Shipping Address */}
							<div className="border border-border/50 bg-card/30 p-4 clip-mecha">
								<h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
									<MapPin className="h-4 w-4" />
									Shipping Address
								</h3>
								<p className="text-sm font-medium">{trackedOrder.guestName}</p>
								<p className="text-sm text-muted-foreground mt-1">
									{trackedOrder.shippingAddress}
								</p>
							</div>

							{/* Payment Summary */}
							<div className="border border-border/50 bg-card/30 p-4 clip-mecha">
								<h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
									<CreditCard className="h-4 w-4" />
									Payment
								</h3>
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Method</span>
										<span>
											{
												paymentMethodLabels[
													trackedOrder.paymentMethod as keyof typeof paymentMethodLabels
												]
											}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Subtotal</span>
										<span>{formatCurrency(trackedOrder.subtotal)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Shipping</span>
										<span>{formatCurrency(trackedOrder.shippingFee)}</span>
									</div>
									{trackedOrder.discountAmount > 0 && (
										<div className="flex justify-between text-green-500">
											<span>Discount</span>
											<span>
												-{formatCurrency(trackedOrder.discountAmount)}
											</span>
										</div>
									)}
									<div className="flex justify-between font-bold text-lg border-t border-border/30 pt-2">
										<span>Total</span>
										<span className="text-primary">
											{formatCurrency(trackedOrder.totalAmount)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
