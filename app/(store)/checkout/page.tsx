"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Truck,
	CreditCard,
	Banknote,
	Package,
	Rocket,
	ArrowLeft,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { useCartStore, selectSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/product-utils";
import {
	checkoutFormSchema,
	type CheckoutFormValues,
} from "@/schemas/checkout";
import { placeOrder } from "@/app/actions/order";
import { useAuth } from "@/hooks/use-auth";

const SHIPPING_FEE = 5;

export default function CheckoutPage() {
	const router = useRouter();
	const { items, clearCart } = useCartStore();
	const subtotal = useCartStore(selectSubtotal);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	const form = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			guestName: "",
			guestEmail: "",
			guestPhone: "",
			shippingAddress: "",
			note: "",
			paymentMethod: "COD",
		},
	});

	const { user } = useAuth();

	// Handle hydration mismatch
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Prefill form when user data is available
	useEffect(() => {
		if (user) {
			form.reset({
				guestName: user.name || "",
				guestEmail: user.email || "",
				guestPhone: user.phone || "",
				shippingAddress: user.address || "",
				note: "",
				paymentMethod: "COD",
			});
		}
	}, [user, form]);

	// Redirect if cart is empty
	useEffect(() => {
		if (isMounted && items.length === 0) {
			router.push("/");
		}
	}, [isMounted, items.length, router]);

	const total = subtotal + SHIPPING_FEE;

	const onSubmit = async (data: CheckoutFormValues) => {
		setIsSubmitting(true);

		try {
			const result = await placeOrder(data, items);

			if (result.success && result.orderId) {
				clearCart();
				router.push(`/checkout/success/${result.orderId}`);
			} else {
				toast.error(result.message || "Failed to place order");
			}
		} catch (error) {
			toast.error("Something went wrong. Please try again.");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Show loading while hydrating
	if (!isMounted) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="h-8 w-8 animate-spin text-primary" />
			</div>
		);
	}

	// Empty cart guard
	if (items.length === 0) {
		return null;
	}

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Header */}
			<div className="relative border-b border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
				<div className="container px-4 py-8">
					<Link
						href="/"
						className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
						<ArrowLeft className="h-4 w-4" />
						<span className="font-mono">RETURN TO BASE</span>
					</Link>

					<div className="flex items-center gap-3">
						<div className="w-1 h-8 bg-primary" />
						<div>
							<h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wider">
								Mission Checkout
							</h1>
							<p className="font-mono text-xs text-muted-foreground mt-1">
								FINALIZE DEPLOYMENT PARAMETERS
							</p>
						</div>
					</div>
				</div>

				{/* Decorative corner lines */}
				<div className="absolute top-0 right-0 w-32 h-px bg-gradient-to-l from-primary to-transparent" />
				<div className="absolute top-0 right-0 w-px h-32 bg-gradient-to-b from-primary to-transparent" />
			</div>

			{/* Main Content */}
			<div className="container px-4 py-8">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="grid lg:grid-cols-5 gap-8">
						{/* Left Column - Shipping Info */}
						<div className="lg:col-span-3 space-y-6">
							{/* Shipping Information Section */}
							<div className="border border-border/50 bg-card/50 p-6">
								<div className="flex items-center gap-2 mb-6">
									<Truck className="h-5 w-5 text-primary" />
									<h2 className="font-display text-lg font-semibold uppercase tracking-wider">
										Shipping Information
									</h2>
								</div>

								<div className="grid sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="guestName"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="font-mono text-xs uppercase">
													Full Name
												</FormLabel>
												<FormControl>
													<Input
														placeholder="Enter your name"
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
										name="guestEmail"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="font-mono text-xs uppercase">
													Email
												</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="your@email.com"
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
										name="guestPhone"
										render={({ field }) => (
											<FormItem>
												<FormLabel className="font-mono text-xs uppercase">
													Phone Number
												</FormLabel>
												<FormControl>
													<Input
														placeholder="0901234567"
														className="tech-input-base"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="sm:col-span-2">
										<FormField
											control={form.control}
											name="shippingAddress"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-mono text-xs uppercase">
														Shipping Address
													</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Street, District, City..."
															className="tech-input-base min-h-[100px] resize-none"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className="sm:col-span-2">
										<FormField
											control={form.control}
											name="note"
											render={({ field }) => (
												<FormItem>
													<FormLabel className="font-mono text-xs uppercase">
														Order Notes (Optional)
													</FormLabel>
													<FormControl>
														<Textarea
															placeholder="Special instructions for delivery..."
															className="tech-input-base min-h-[80px] resize-none"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							</div>

							{/* Payment Method Section */}
							<div className="border border-border/50 bg-card/50 p-6">
								<div className="flex items-center gap-2 mb-6">
									<CreditCard className="h-5 w-5 text-primary" />
									<h2 className="font-display text-lg font-semibold uppercase tracking-wider">
										Payment Method
									</h2>
								</div>

								<FormField
									control={form.control}
									name="paymentMethod"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<RadioGroup
													onValueChange={field.onChange}
													defaultValue={field.value}
													className="grid sm:grid-cols-2 gap-4">
													{/* COD Option */}
													<div>
														<RadioGroupItem
															value="COD"
															id="cod"
															className="peer sr-only"
														/>
														<Label
															htmlFor="cod"
															className="flex items-center gap-4 p-4 border border-border/50 bg-background/50 cursor-pointer transition-all
                                hover:border-primary/50
                                peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
															<div className="w-10 h-10 border border-primary/30 flex items-center justify-center">
																<Banknote className="h-5 w-5 text-primary" />
															</div>
															<div>
																<p className="font-display font-semibold">
																	Cash on Delivery
																</p>
																<p className="font-mono text-xs text-muted-foreground">
																	Pay when you receive
																</p>
															</div>
														</Label>
													</div>

													{/* Bank Transfer Option */}
													<div>
														<RadioGroupItem
															value="BANK_TRANSFER"
															id="bank"
															className="peer sr-only"
														/>
														<Label
															htmlFor="bank"
															className="flex items-center gap-4 p-4 border border-border/50 bg-background/50 cursor-pointer transition-all
                                hover:border-primary/50
                                peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5">
															<div className="w-10 h-10 border border-primary/30 flex items-center justify-center">
																<CreditCard className="h-5 w-5 text-primary" />
															</div>
															<div>
																<p className="font-display font-semibold">
																	Bank Transfer
																</p>
																<p className="font-mono text-xs text-muted-foreground">
																	Transfer before shipping
																</p>
															</div>
														</Label>
													</div>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						{/* Right Column - Order Summary */}
						<div className="lg:col-span-2">
							<div className="sticky top-4 border border-border/50 bg-card/50">
								{/* Header */}
								<div className="flex items-center gap-2 p-4 border-b border-border/50">
									<Package className="h-5 w-5 text-primary" />
									<h2 className="font-display text-lg font-semibold uppercase tracking-wider">
										Order Summary
									</h2>
								</div>

								{/* Items List */}
								<div className="max-h-[300px] overflow-y-auto p-4 space-y-3">
									{items.map((item) => (
										<div
											key={item.variantId}
											className="flex gap-3 p-2 bg-background/30">
											<div className="relative w-14 h-14 shrink-0 border border-border/50">
												<Image
													src={item.image || "/placeholder-gundam.jpg"}
													alt={item.name}
													fill
													className="object-cover"
												/>
											</div>
											<div className="flex-1 min-w-0">
												<p className="font-display text-sm font-medium line-clamp-2">
													{item.name}
												</p>
												<div className="flex items-center justify-between mt-1">
													<span className="font-mono text-xs text-muted-foreground">
														x{item.quantity}
													</span>
													<span className="font-mono text-sm text-primary">
														{formatPrice(item.price * item.quantity)}
													</span>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Pricing */}
								<div className="p-4 border-t border-border/50 space-y-3">
									<div className="flex justify-between font-mono text-sm">
										<span className="text-muted-foreground">Subtotal</span>
										<span>{formatPrice(subtotal)}</span>
									</div>
									<div className="flex justify-between font-mono text-sm">
										<span className="text-muted-foreground">Shipping</span>
										<span>{formatPrice(SHIPPING_FEE)}</span>
									</div>
									<div className="flex justify-between font-mono text-sm">
										<span className="text-muted-foreground">Discount</span>
										<span>-{formatPrice(0)}</span>
									</div>

									<div className="pt-3 border-t border-border/30">
										<div className="flex justify-between items-center">
											<span className="font-display font-semibold uppercase">
												Total
											</span>
											<span className="font-display text-2xl font-bold text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
												{formatPrice(total)}
											</span>
										</div>
									</div>
								</div>

								{/* Submit Button */}
								<div className="p-4 border-t border-border/50">
									<Button
										type="submit"
										size="lg"
										className="w-full gap-2"
										disabled={isSubmitting}>
										{isSubmitting ? (
											<>
												<Loader2 className="h-5 w-5 animate-spin" />
												<span className="font-mono tracking-wider">
													PROCESSING...
												</span>
											</>
										) : (
											<>
												<Rocket className="h-5 w-5" />
												<span className="font-mono tracking-wider">
													CONFIRM DEPLOYMENT
												</span>
											</>
										)}
									</Button>
								</div>

								{/* Decorative Lines */}
								<div className="absolute bottom-0 left-0 w-16 h-px bg-gradient-to-r from-primary to-transparent" />
								<div className="absolute bottom-0 left-0 w-px h-16 bg-gradient-to-t from-primary to-transparent" />
							</div>
						</div>
					</form>
				</Form>
			</div>
		</div>
	);
}
