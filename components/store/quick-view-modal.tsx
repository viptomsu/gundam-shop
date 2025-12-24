"use client";

import { ProductPrice } from "@/components/store/product-price";
import { StockBadge } from "@/components/store/stock-badge";
import { VariantSelector } from "@/components/store/variant-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	getDiscountPercent,
	getDisplayPrice,
	getOriginalPrice,
	isVariantOnSale,
} from "@/lib/product-utils";
import { useCartStore } from "@/store/cart";
import { Check, ExternalLink, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

// Duplicate of ProductVariant from Prisma/types to avoid direct Prisma import in client component
interface ProductVariant {
	id: string;
	name: string;
	price: string | number;
	salePrice?: string | number | null;
	stock: number;
	image?: string | null;
}

import { useModalStore } from "@/hooks/use-modal-store";
import { ModalIds } from "@/types/modal";

// ... existing imports

interface QuickViewModalArgs {
	product: {
		id: string;
		name: string;
		slug: string;
		description?: string;
		images: string[];
		variants: ProductVariant[];
		grade?: string | null;
	};
}

export function QuickViewModal() {
	const { modals, hide } = useModalStore();
	const modalState = modals[ModalIds.QUICK_VIEW];
	const isOpen = modalState?.isOpen || false;
	const args = modalState?.args as QuickViewModalArgs;
	const product = args?.product;

	// Initialize with first variant, but verify product exists first
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
		null
	);

	// Update selected variant when product changes
	useEffect(() => {
		if (product && !selectedVariant && product.variants.length > 0) {
			setSelectedVariant(product.variants[0]);
		}

		// Reset when closed
		if (!isOpen && selectedVariant) {
			setSelectedVariant(null);
		}
	}, [product, selectedVariant, isOpen]);

	const addItem = useCartStore((state) => state.addItem);

	const handleClose = () => {
		hide(ModalIds.QUICK_VIEW);
		setSelectedVariant(null);
	};

	// Determine image to show: variant image > first product image > placeholder
	const displayImage = useMemo(() => {
		const images = product?.images || [];
		return selectedVariant?.image || images[0] || "/placeholder-gundam.jpg";
	}, [selectedVariant, product]);

	if (!product || !selectedVariant) return null;

	// Price calculations
	const variantToUse = selectedVariant || product.variants[0];
	const isOnSale = isVariantOnSale(variantToUse as any);
	const displayPrice = getDisplayPrice(variantToUse as any);
	const originalPrice = getOriginalPrice(variantToUse as any);
	const discountPercent = getDiscountPercent(variantToUse as any);

	const handleAddToCart = () => {
		if (!selectedVariant) return;
		const itemName = `${product.name} - ${selectedVariant.name}`;
		addItem({
			variantId: selectedVariant.id,
			productId: product.id,
			name: itemName,
			slug: product.slug,
			image: displayImage,
			price: displayPrice,
			quantity: 1,
			maxStock: selectedVariant.stock,
		});

		toast.success("Unit acquired", {
			description: itemName,
			icon: <Check className="h-4 w-4 text-primary" />,
		});
		handleClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 border-primary/20 bg-background/95 backdrop-blur-xl">
				<div className="grid md:grid-cols-2">
					{/* Left Column: Image */}
					<div className="relative aspect-square md:aspect-auto bg-secondary/20 p-6 flex items-center justify-center overflow-hidden group">
						{/* Grid Overlay */}
						<div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-size-[20px_20px] opacity-50" />

						{/* Image */}
						<div className="relative w-full h-full min-h-[300px]">
							<Image
								src={displayImage}
								alt={product.name}
								fill
								className="object-contain transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						{/* Sale Badge */}
						{isOnSale && (
							<div className="absolute top-4 left-4 z-10">
								<Badge variant="destructive" className="animate-pulse">
									-{discountPercent}%
								</Badge>
							</div>
						)}
					</div>

					{/* Right Column: Details */}
					<div className="p-6 flex flex-col h-full bg-card/50">
						<DialogHeader className="mb-4 text-left">
							<div className="flex items-center gap-2 mb-2">
								{product.grade && (
									<Badge
										variant="outline"
										className="border-primary/20 text-primary">
										{product.grade}
									</Badge>
								)}
								<Badge variant="secondary" className="font-mono text-[10px]">
									ID: {product.id.slice(0, 4)}
								</Badge>
							</div>
							<DialogTitle className="font-display text-xl md:text-2xl font-bold uppercase tracking-wide leading-tight">
								{product.name}
							</DialogTitle>
						</DialogHeader>

						{/* Price */}
						<div className="mb-6">
							<ProductPrice
								price={displayPrice}
								originalPrice={originalPrice}
								isOnSale={isOnSale}
								size="default"
							/>
						</div>

						{/* Variant Selector */}
						{product.variants.length > 0 && (
							<div className="mb-6">
								<VariantSelector
									variants={product.variants}
									selectedVariant={selectedVariant}
									onSelect={setSelectedVariant}
									size="sm"
								/>
							</div>
						)}

						<div className="mb-auto">
							<StockBadge stock={selectedVariant?.stock ?? 0} />
						</div>

						{/* Actions */}
						<div className="space-y-3 mt-6 pt-6 border-t border-border/50">
							<Button
								className="w-full gap-2"
								size="lg"
								disabled={!selectedVariant || selectedVariant.stock === 0}
								onClick={handleAddToCart}>
								<ShoppingCart className="h-4 w-4" />
								<span>
									{!selectedVariant || selectedVariant.stock === 0
										? "OUT OF STOCK"
										: "ADD TO HANGAR"}
								</span>
							</Button>

							<Button variant="outline" className="w-full gap-2" asChild>
								<Link href={`/products/${product.slug}`} onClick={handleClose}>
									<ExternalLink className="h-4 w-4" />
									VIEW FULL DETAILS
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
