import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	CheckCircle2,
	Package,
	Rocket,
	Copy,
	CreditCard,
	ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { getOrderById } from "@/app/actions/order";
import { formatPrice } from "@/lib/product-utils";
import { CopyButton } from "@/components/copy-button";

interface SuccessPageProps {
	params: Promise<{ id: string }>;
}

export default async function CheckoutSuccessPage({
	params,
}: SuccessPageProps) {
	const { id } = await params;
	const order = await getOrderById(id);

	if (!order) {
		notFound();
	}

	const isBankTransfer = order.paymentMethod === "BANK_TRANSFER";

	return (
		<div className="min-h-screen bg-background">
			{/* Success Hero */}
			<div className="relative border-b border-primary/20 bg-gradient-to-b from-primary/10 to-transparent overflow-hidden">
				{/* Animated Background Elements */}
				<div className="absolute inset-0 opacity-20">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
				</div>

				<div className="container px-4 py-12 md:py-20 relative z-10">
					{/* Success Icon */}
					<div className="flex justify-center mb-6">
						<div className="relative">
							<div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse" />
							<div className="relative w-20 h-20 border-2 border-primary bg-primary/10 flex items-center justify-center">
								<CheckCircle2 className="h-10 w-10 text-primary" />
							</div>
						</div>
					</div>

					{/* Success Message */}
					<div className="text-center">
						<h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wider mb-2">
							<span className="text-primary drop-shadow-[0_0_20px_rgba(6,182,212,0.5)]">
								Mission Confirmed
							</span>
						</h1>
						<p className="font-mono text-muted-foreground">
							Your order has been successfully placed
						</p>
					</div>

					{/* Order Number */}
					<div className="mt-8 max-w-md mx-auto">
						<div className="border border-primary/30 bg-card/50 backdrop-blur-sm p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="font-mono text-xs text-muted-foreground uppercase">
										Tracking Number
									</p>
									<p className="font-display text-xl font-bold text-primary mt-1">
										{order.orderNumber}
									</p>
								</div>
								<CopyButton text={order.orderNumber} />
							</div>
						</div>
					</div>
				</div>

				{/* Decorative Lines */}
				<div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-primary to-transparent" />
				<div className="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-primary to-transparent" />
				<div className="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-primary to-transparent" />
				<div className="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-primary to-transparent" />
			</div>

			{/* Content */}
			<div className="container px-4 py-8">
				<div className="max-w-2xl mx-auto space-y-6">
					{/* Bank Transfer Instructions */}
					{isBankTransfer && (
						<div className="border border-accent/30 bg-accent/5 p-6">
							<div className="flex items-center gap-2 mb-4">
								<CreditCard className="h-5 w-5 text-accent" />
								<h2 className="font-display text-lg font-semibold uppercase tracking-wider text-accent">
									Payment Instructions
								</h2>
							</div>

							<p className="font-mono text-sm text-muted-foreground mb-4">
								Please transfer the total amount to complete your order:
							</p>

							<div className="space-y-3 bg-background/50 p-4 border border-border/50">
								<div className="flex items-center justify-between">
									<span className="font-mono text-xs text-muted-foreground uppercase">
										Bank
									</span>
									<span className="font-display font-semibold">
										Vietcombank
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-mono text-xs text-muted-foreground uppercase">
										Account Number
									</span>
									<div className="flex items-center gap-2">
										<span className="font-mono font-semibold">
											9999888877776666
										</span>
										<CopyButton text="9999888877776666" />
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-mono text-xs text-muted-foreground uppercase">
										Account Name
									</span>
									<span className="font-display font-semibold">
										GUNDAM STORE CO., LTD
									</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="font-mono text-xs text-muted-foreground uppercase">
										Transfer Content
									</span>
									<div className="flex items-center gap-2">
										<span className="font-mono font-semibold text-primary">
											{order.orderNumber}
										</span>
										<CopyButton text={order.orderNumber} />
									</div>
								</div>
								<div className="pt-3 mt-3 border-t border-border/30 flex items-center justify-between">
									<span className="font-mono text-xs text-muted-foreground uppercase">
										Amount
									</span>
									<span className="font-display text-xl font-bold text-accent">
										{formatPrice(Number(order.totalAmount))}
									</span>
								</div>
							</div>

							<p className="font-mono text-xs text-muted-foreground mt-4">
								※ Your order will be processed after payment confirmation
							</p>
						</div>
					)}

					{/* Order Summary */}
					<div className="border border-border/50 bg-card/50 p-6">
						<div className="flex items-center gap-2 mb-4">
							<Package className="h-5 w-5 text-primary" />
							<h2 className="font-display text-lg font-semibold uppercase tracking-wider">
								Order Details
							</h2>
						</div>

						{/* Items */}
						<div className="space-y-3 mb-4">
							{order.orderItems.map((item) => {
								const productName = item.variant.product.name;
								const variantName = item.variant.name;
								const image =
									item.variant.image ||
									item.variant.product.images[0] ||
									"/placeholder-gundam.jpg";

								return (
									<div
										key={item.id}
										className="flex gap-3 p-2 bg-background/30">
										<div className="relative w-12 h-12 shrink-0 border border-border/50">
											<Image
												src={image}
												alt={productName}
												fill
												className="object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-display text-sm font-medium line-clamp-1">
												{productName}
												{variantName !== "Default" && ` - ${variantName}`}
											</p>
											<div className="flex items-center justify-between mt-1">
												<span className="font-mono text-xs text-muted-foreground">
													x{item.quantity}
												</span>
												<span className="font-mono text-sm text-primary">
													{formatPrice(Number(item.price) * item.quantity)}
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{/* Totals */}
						<div className="border-t border-border/30 pt-4 space-y-2">
							<div className="flex justify-between font-mono text-sm">
								<span className="text-muted-foreground">Subtotal</span>
								<span>{formatPrice(Number(order.subtotal))}</span>
							</div>
							<div className="flex justify-between font-mono text-sm">
								<span className="text-muted-foreground">Shipping</span>
								<span>{formatPrice(Number(order.shippingFee))}</span>
							</div>
							{Number(order.discountAmount) > 0 && (
								<div className="flex justify-between font-mono text-sm">
									<span className="text-muted-foreground">Discount</span>
									<span className="text-green-500">
										-{formatPrice(Number(order.discountAmount))}
									</span>
								</div>
							)}
							<div className="pt-2 border-t border-border/30 flex justify-between items-center">
								<span className="font-display font-semibold uppercase">
									Total
								</span>
								<span className="font-display text-xl font-bold text-primary">
									{formatPrice(Number(order.totalAmount))}
								</span>
							</div>
						</div>
					</div>

					{/* Shipping Info */}
					<div className="border border-border/50 bg-card/50 p-6">
						<h3 className="font-display font-semibold uppercase tracking-wider mb-3">
							Shipping Information
						</h3>
						<div className="space-y-2 font-mono text-sm">
							<p>
								<span className="text-muted-foreground">Name:</span>{" "}
								{order.guestName}
							</p>
							<p>
								<span className="text-muted-foreground">Email:</span>{" "}
								{order.guestEmail}
							</p>
							<p>
								<span className="text-muted-foreground">Phone:</span>{" "}
								{order.guestPhone}
							</p>
							<p>
								<span className="text-muted-foreground">Address:</span>{" "}
								{order.shippingAddress}
							</p>
							{order.note && (
								<p>
									<span className="text-muted-foreground">Note:</span>{" "}
									{order.note}
								</p>
							)}
						</div>
					</div>

					{/* Continue Shopping */}
					<div className="text-center pt-4">
						<Button asChild size="lg" className="gap-2">
							<Link href="/">
								<Rocket className="h-5 w-5" />
								<span className="font-mono tracking-wider">
									CONTINUE SHOPPING
								</span>
								<ArrowRight className="h-4 w-4" />
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
