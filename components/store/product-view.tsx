"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
	ShoppingCart,
	ChevronLeft,
	Hexagon,
	Crosshair,
	Zap,
	Layers,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StockBadge } from "@/components/store/stock-badge";
import {
	isVariantOnSale,
	getDisplayPrice,
	getOriginalPrice,
	getDiscountPercent,
} from "@/lib/product-utils";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { ProductPrice } from "@/components/store/product-price";
import { VariantSelector } from "@/components/store/variant-selector";

import type { Product, ProductVariant, Brand, Series } from "@prisma/client";

type ProductWithRelations = Product & {
	variants: ProductVariant[];
	brand: Brand;
	series: Series | null;
};

interface ProductViewProps {
	product: ProductWithRelations;
}

export function ProductView({ product }: ProductViewProps) {
	const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
		product.variants[0]
	);
	const [activeImageIndex, setActiveImageIndex] = useState(0);
	const addItem = useCartStore((state) => state.addItem);

	// Combine variant image with product images for gallery
	const galleryImages = useMemo(() => {
		const images: string[] = [];

		// Add variant image first if it exists
		if (selectedVariant?.image) {
			images.push(selectedVariant.image);
		}

		// Add product images
		product.images.forEach((img) => {
			if (!images.includes(img)) {
				images.push(img);
			}
		});

		return images.length > 0 ? images : ["/placeholder-gundam.jpg"];
	}, [selectedVariant, product.images]);

	// Reset image index when variant changes
	const handleVariantChange = (variant: ProductVariant) => {
		setSelectedVariant(variant);
		setActiveImageIndex(0);
	};

	// Price calculations
	const isOnSale = isVariantOnSale(selectedVariant);
	const displayPrice = getDisplayPrice(selectedVariant);
	const originalPrice = getOriginalPrice(selectedVariant);
	const discountPercent = getDiscountPercent(selectedVariant);

	const handleAddToCart = () => {
		const displayPrice = getDisplayPrice(selectedVariant);
		const itemName = `${product.name} - ${selectedVariant.name}`;

		addItem({
			variantId: selectedVariant.id,
			productId: product.id,
			name: itemName,
			slug: product.slug,
			image:
				selectedVariant.image || product.images[0] || "/placeholder-gundam.jpg",
			price: displayPrice,
			quantity: 1,
			maxStock: selectedVariant.stock,
		});

		toast.success("Unit acquired", {
			description: itemName,
		});
	};

	return (
		<div className="relative">
			{/* Background Grid Pattern */}
			<div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[50px_50px]" />

			{/* Scan Lines Effect */}
			<div className="fixed inset-0 -z-10 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />

			<div className="container mx-auto px-4 py-8">
				{/* Back Navigation */}
				<Link
					href="/"
					className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
					<ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
					<span className="font-mono text-sm uppercase tracking-wider">
						Return to Base
					</span>
				</Link>

				{/* Main Content Grid */}
				<div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
					{/* Left Column - Gallery */}
					<div className="space-y-4">
						{/* Main Image Viewport */}
						<div className="relative group">
							{/* Outer Glow Border */}
							<div className="absolute -inset-1 bg-linear-to-b from-primary/30 via-primary/10 to-primary/30 opacity-50 group-hover:opacity-100 transition-opacity duration-500 blur-sm clip-mecha" />

							{/* Main Image Container */}
							<div className="relative aspect-square bg-card border border-primary/20 overflow-hidden clip-mecha">
								{/* Grid Overlay */}
								<div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-size-[30px_30px] opacity-50 pointer-events-none" />

								{/* Corner Targeting Brackets */}
								<div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/50 z-20" />
								<div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/50 z-20" />
								<div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/50 z-20" />
								<div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/50 z-20" />

								{/* Image */}
								<Image
									src={galleryImages[activeImageIndex]}
									alt={product.name}
									fill
									className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
									priority
								/>

								{/* Scan Effect on Hover */}
								<div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-scan-vertical pointer-events-none" />

								{/* Sale Badge */}
								{isOnSale && (
									<div className="absolute top-4 left-4 z-30">
										<Badge
											variant="destructive"
											className="shadow-[0_0_15px_rgba(255,0,60,0.5)] animate-pulse">
											<Zap className="h-3 w-3" />-{discountPercent}% OFF
										</Badge>
									</div>
								)}

								{/* Image Counter */}
								<div className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-background/80 backdrop-blur-sm border border-primary/30 font-mono text-xs text-primary">
									{activeImageIndex + 1} / {galleryImages.length}
								</div>
							</div>
						</div>

						{/* Thumbnail Strip */}
						{galleryImages.length > 1 && (
							<div className="flex gap-2 overflow-x-auto pb-2">
								{galleryImages.map((img, index) => (
									<button
										key={index}
										onClick={() => setActiveImageIndex(index)}
										className={cn(
											"relative shrink-0 w-20 h-20 border-2 transition-all duration-300 overflow-hidden",
											index === activeImageIndex
												? "border-primary shadow-[0_0_10px_rgba(6,182,212,0.5)]"
												: "border-border/50 hover:border-primary/50"
										)}>
										<Image
											src={img}
											alt={`${product.name} view ${index + 1}`}
											fill
											className="object-cover"
										/>
										{/* Active Indicator */}
										{index === activeImageIndex && (
											<div className="absolute inset-0 bg-primary/10" />
										)}
									</button>
								))}
							</div>
						)}
					</div>

					{/* Right Column - Product Info HUD Panel */}
					<div className="relative h-fit">
						{/* Outer Glow Effect */}
						<div className="absolute inset-0 -m-1 bg-linear-to-b from-primary/20 via-primary/5 to-primary/20 opacity-50 blur-sm clip-mecha" />

						{/* Border Wrapper */}
						<div
							className="relative p-px bg-linear-to-b from-primary/50 via-primary/20 to-primary/50 clip-mecha"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
							}}>
							{/* HUD Panel Content */}
							<div
								className="relative bg-card/95 backdrop-blur-md p-6 lg:p-8"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
								}}>
								{/* Decorative Corner Lines */}
								<div className="absolute top-0 left-0 w-16 h-px bg-linear-to-r from-primary to-transparent" />
								<div className="absolute top-0 left-0 w-px h-16 bg-linear-to-b from-primary to-transparent" />
								<div className="absolute bottom-0 right-0 w-16 h-px bg-linear-to-l from-primary to-transparent" />
								<div className="absolute bottom-0 right-0 w-px h-16 bg-linear-to-t from-primary to-transparent" />

								{/* Header Section */}
								<div className="space-y-4 mb-6">
									{/* Brand & Series Badges */}
									<div className="flex flex-wrap items-center gap-2">
										<Badge variant="outline" className="gap-1">
											<Hexagon className="h-3 w-3" />
											{product.brand.name}
										</Badge>
										{product.series && (
											<Badge variant="outline" className="gap-1">
												<Layers className="h-3 w-3" />
												{product.series.name}
											</Badge>
										)}
										{product.grade && (
											<Badge className="bg-accent text-accent-foreground">
												{product.grade}
											</Badge>
										)}
									</div>

									{/* Product Name */}
									<h1 className="font-display text-2xl lg:text-3xl font-bold tracking-wide text-foreground leading-tight">
										{product.name}
									</h1>

									{/* Product ID */}
									<div className="flex items-center gap-2 text-muted-foreground font-mono text-xs">
										<Crosshair className="h-3 w-3" />
										<span>UNIT ID: {product.id.slice(0, 8).toUpperCase()}</span>
									</div>
								</div>

								{/* Divider */}
								<div className="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent mb-6" />

								{/* Price Section */}
								<div className="mb-6">
									<div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">
										Unit Cost
									</div>
									<ProductPrice
										price={displayPrice}
										originalPrice={originalPrice}
										isOnSale={isOnSale}
										size="lg"
									/>
								</div>

								{/* Variant Selector */}
								{product.variants.length > 1 && (
									<div className="mb-6">
										<VariantSelector
											variants={product.variants}
											selectedVariant={selectedVariant}
											onSelect={handleVariantChange}
											label="Select Variant"
										/>
									</div>
								)}

								{/* Stock Status */}
								<div className="mb-6">
									<StockBadge stock={selectedVariant.stock} />
								</div>

								{/* Scale Info */}
								{product.scale && (
									<div className="mb-6 px-4 py-3 bg-secondary/30 border border-border/50">
										<div className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">
											Scale
										</div>
										<div className="font-display text-lg font-bold text-foreground">
											{product.scale}
										</div>
									</div>
								)}

								{/* Divider */}
								<div className="h-px bg-linear-to-r from-transparent via-primary/30 to-transparent mb-6" />

								{/* Add to Cart Button */}
								<Button
									size="lg"
									className="w-full gap-3 text-base py-6"
									disabled={selectedVariant.stock === 0}
									onClick={handleAddToCart}>
									<ShoppingCart className="h-5 w-5" />
									<span className="font-mono tracking-wider">
										{selectedVariant.stock === 0
											? "CURRENTLY UNAVAILABLE"
											: "INIT_PURCHASE"}
									</span>
								</Button>

								{/* Bottom Tech Line */}
								<div className="mt-6 flex items-center justify-center gap-2">
									{[...Array(5)].map((_, i) => (
										<div
											key={i}
											className="w-2 h-2 bg-primary/30 rotate-45 hover:bg-primary transition-colors"
										/>
									))}
								</div>
							</div>
						</div>
						{/* End Border Wrapper */}
					</div>
				</div>

				{/* Description Section */}
				{product.description && (
					<div className="mt-12">
						<div className="relative bg-card/50 border border-primary/10 p-6 lg:p-8 clip-mecha">
							{/* Section Header */}
							<div className="flex items-center gap-3 mb-4">
								<div className="w-1 h-6 bg-primary" />
								<h2 className="font-display text-xl font-bold uppercase tracking-wider">
									Unit Specifications
								</h2>
							</div>

							{/* Description Content */}
							<div
								className="rich-text text-muted-foreground"
								dangerouslySetInnerHTML={{ __html: product.description }}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
