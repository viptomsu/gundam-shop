"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Package, Rocket } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
	SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore, selectTotalItems, selectSubtotal } from "@/store/cart";
import { formatPrice } from "@/lib/product-utils";
import { cn } from "@/lib/utils";

export function CartSheet() {
	const { items, isOpen, setOpen, removeItem, updateQuantity } = useCartStore();
	const totalItems = useCartStore(selectTotalItems);
	const subtotal = useCartStore(selectSubtotal);

	return (
		<Sheet open={isOpen} onOpenChange={setOpen}>
			<SheetContent className="flex flex-col border-l border-primary/30 bg-background/95 backdrop-blur-md w-full max-w-md sm:max-w-lg">
				{/* Header */}
				<SheetHeader className="border-b border-primary/20 pb-4">
					<div className="flex items-center gap-3">
						{/* Decorative Line */}
						<div className="w-1 h-6 bg-primary" />
						<SheetTitle className="font-display text-xl uppercase tracking-wider flex items-center gap-2">
							Storage Module
							{totalItems > 0 && (
								<Badge className="bg-primary text-primary-foreground ml-2">
									{totalItems}
								</Badge>
							)}
						</SheetTitle>
					</div>
					<SheetDescription className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
						Unit inventory manifest
					</SheetDescription>
				</SheetHeader>

				{/* Body */}
				{items.length === 0 ? (
					<EmptyState />
				) : (
					<ScrollArea className="flex-1 -mx-4 px-4">
						<div className="space-y-4 py-4">
							{items.map((item) => (
								<CartItemCard
									key={item.variantId}
									item={item}
									onRemove={() => removeItem(item.variantId)}
									onUpdateQuantity={(delta) =>
										updateQuantity(item.variantId, delta)
									}
								/>
							))}
						</div>
					</ScrollArea>
				)}

				{/* Footer */}
				{items.length > 0 && (
					<SheetFooter className="border-t border-primary/20 pt-4 mt-auto">
						{/* Subtotal */}
						<div className="flex items-center justify-between w-full mb-4">
							<span className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
								Subtotal
							</span>
							<span className="font-display text-2xl font-bold text-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">
								{formatPrice(subtotal)}
							</span>
						</div>

						{/* Checkout Button */}
						<Button asChild size="lg" className="w-full gap-2">
							<Link href="/checkout">
								<Rocket className="h-5 w-5" />
								<span className="font-mono tracking-wider">
									DEPLOY TO CHECKOUT
								</span>
							</Link>
						</Button>
					</SheetFooter>
				)}

				{/* Decorative Corner Lines */}
				<div className="absolute top-0 left-0 w-16 h-px bg-linear-to-r from-primary to-transparent" />
				<div className="absolute top-0 left-0 w-px h-16 bg-linear-to-b from-primary to-transparent" />
				<div className="absolute bottom-0 right-0 w-16 h-px bg-linear-to-l from-primary to-transparent" />
				<div className="absolute bottom-0 right-0 w-px h-16 bg-linear-to-t from-primary to-transparent" />
			</SheetContent>
		</Sheet>
	);
}

function EmptyState() {
	return (
		<div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
			{/* Icon Container */}
			<div className="relative">
				<div className="absolute -inset-4 bg-primary/10 blur-xl rounded-full" />
				<div className="relative w-20 h-20 border-2 border-dashed border-primary/30 rounded-lg flex items-center justify-center">
					<Package className="h-10 w-10 text-muted-foreground/50" />
				</div>
			</div>

			{/* Text */}
			<div className="text-center space-y-2">
				<h3 className="font-display text-lg uppercase tracking-wider text-muted-foreground">
					Container Empty
				</h3>
				<p className="font-mono text-xs text-muted-foreground/70">
					No units currently stored in module
				</p>
			</div>

			{/* Decorative Elements */}
			<div className="flex items-center gap-2 mt-4">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="w-1.5 h-1.5 bg-primary/30 rotate-45" />
				))}
			</div>
		</div>
	);
}

interface CartItemCardProps {
	item: {
		variantId: string;
		name: string;
		slug: string;
		image: string;
		price: number;
		quantity: number;
		maxStock: number;
	};
	onRemove: () => void;
	onUpdateQuantity: (delta: number) => void;
}

function CartItemCard({ item, onRemove, onUpdateQuantity }: CartItemCardProps) {
	const isMinQuantity = item.quantity <= 1;
	const isMaxQuantity = item.quantity >= item.maxStock;

	return (
		<div className="group relative bg-card/50 border border-border/50 p-3 hover:border-primary/30 transition-colors">
			{/* Grid Layout */}
			<div className="flex gap-3">
				{/* Image */}
				<Link href={`/products/${item.slug}`} className="shrink-0">
					<div className="relative w-16 h-16 bg-secondary/30 border border-border/50 overflow-hidden">
						<Image
							src={item.image || "/placeholder-gundam.jpg"}
							alt={item.name}
							fill
							className="object-cover"
						/>
						{/* Hover overlay */}
						<div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
					</div>
				</Link>

				{/* Details */}
				<div className="flex-1 min-w-0 flex flex-col justify-between">
					{/* Name & Price Row */}
					<div>
						<Link
							href={`/products/${item.slug}`}
							className="font-display text-sm font-medium leading-tight line-clamp-2 hover:text-primary transition-colors">
							{item.name}
						</Link>
						<div className="font-mono text-sm text-primary mt-1">
							{formatPrice(item.price)}
						</div>
					</div>

					{/* Quantity Controls */}
					<div className="flex items-center justify-between mt-2">
						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								size="icon"
								className="h-6 w-6"
								onClick={() => onUpdateQuantity(-1)}
								disabled={isMinQuantity}>
								<Minus className="h-3 w-3" />
							</Button>
							<span className="font-mono text-sm w-8 text-center">
								{item.quantity}
							</span>
							<Button
								variant="outline"
								size="icon"
								className="h-6 w-6"
								onClick={() => onUpdateQuantity(1)}
								disabled={isMaxQuantity}>
								<Plus className="h-3 w-3" />
							</Button>
						</div>

						{/* Delete Button */}
						<Button
							variant="ghost"
							size="icon"
							className="h-6 w-6 text-muted-foreground hover:text-destructive"
							onClick={onRemove}>
							<Trash2 className="h-3.5 w-3.5" />
						</Button>
					</div>
				</div>
			</div>

			{/* Line total */}
			<div className="flex justify-end mt-2 pt-2 border-t border-border/30">
				<span className="font-mono text-xs text-muted-foreground">
					Line Total:{" "}
					<span className="text-foreground">
						{formatPrice(item.price * item.quantity)}
					</span>
				</span>
			</div>
		</div>
	);
}
