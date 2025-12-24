"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal-store";
import { ModalIds } from "@/types/modal";
import { Crosshair, Eye, Scan } from "lucide-react";
import Link from "next/link";

// Define local variant interface to match what's needed for the modal
interface LocalProductVariant {
	id: string;
	name: string;
	price: string | number;
	salePrice?: string | number | null;
	stock: number;
	image?: string | null;
}

interface ProductCardProps {
	id: string;
	name: string;
	slug: string;
	price: number;
	image?: string;
	grade?: string;
	isNew?: boolean;
	variants?: LocalProductVariant[];
	description?: string;
}

export function ProductCard({
	id,
	name,
	slug,
	price,
	image,
	grade,
	isNew,
	variants = [],
	description,
}: ProductCardProps) {
	const { show } = useModal(ModalIds.QUICK_VIEW);

	const handleQuickView = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		show({
			product: {
				id,
				name,
				slug,
				description,
				images: image ? [image] : [],
				variants,
				grade,
			},
		});
	};

	return (
		<>
			<div className="group relative">
				{/* Tech Border Decoration */}
				<div
					className="absolute -inset-0.5 bg-linear-to-b from-primary/50 to-accent/50 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100"
					style={{
						clipPath:
							"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
					}}
				/>

				{/* Border Wrapper with Glow */}
				<div
					className="relative h-full w-full p-px transition-all duration-500 bg-linear-to-b from-primary/20 via-primary/5 to-primary/20 group-hover:from-primary group-hover:via-primary/50 group-hover:to-primary group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
					style={{
						clipPath:
							"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
					}}>
					<Card
						className="relative h-full w-full overflow-hidden border-0 bg-card/90 backdrop-blur-sm"
						style={{
							clipPath:
								"polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
						}}>
						{/* Top Ticks */}
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] flex justify-between opacity-50">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="w-0.5 h-full bg-primary/50 group-hover:bg-primary transition-colors"
								/>
							))}
						</div>

						{/* Bottom Ticks */}
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] flex justify-between opacity-50">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="w-0.5 h-full bg-primary/50 group-hover:bg-primary transition-colors"
								/>
							))}
						</div>

						{/* Image Viewport */}
						<div className="relative aspect-square overflow-hidden bg-secondary/20">
							{/* Grid Overlay */}
							<div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-size-[20px_20px] opacity-50" />

							{isNew && (
								<Badge className="absolute left-2 top-2 z-20 bg-accent text-accent-foreground shadow-[0_0_10px_rgba(255,215,0,0.5)] hover:bg-accent">
									NEW ARRIVAL
								</Badge>
							)}

							{/* Image */}
							<div
								className="h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
								style={{
									backgroundImage: `url(${image || "/placeholder-gundam.jpg"})`,
								}}
							/>

							{/* Scanning Effect */}
							<div className="absolute inset-0 z-10 bg-linear-to-b from-transparent via-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:animate-scan" />

							{/* Quick Add Overlay */}
							<div className="absolute inset-x-0 bottom-0 z-20 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
								<Button
									className="w-full gap-2 shadow-lg"
									size="sm"
									onClick={handleQuickView}>
									<Eye className="h-4 w-4" />
									<span className="font-mono text-xs">QUICK VIEW</span>
								</Button>
							</div>
						</div>

						<CardContent className="relative space-y-2 p-4">
							{/* Decorative Line */}
							<div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-primary/20 to-transparent" />

							<div className="flex items-center justify-between">
								{grade && (
									<Badge
										variant="outline"
										className="border-primary/20 bg-primary/5 font-mono text-[10px] text-primary backdrop-blur-sm">
										[{grade}]
									</Badge>
								)}
								<div className="flex items-center gap-1 text-[10px] text-muted-foreground">
									<Scan className="h-3 w-3" />
									<span className="font-mono">ID: {id.slice(0, 4)}</span>
								</div>
							</div>

							<Link
								href={`/products/${slug}`}
								className="block group-hover:text-primary transition-colors">
								<h3 className="font-display line-clamp-2 text-lg font-bold leading-tight tracking-wide min-h-12">
									{name}
								</h3>
							</Link>
						</CardContent>

						<CardFooter className="p-4 pt-0">
							<div className="flex w-full items-end justify-between border-t border-border/50 pt-3">
								<div className="flex flex-col">
									<span className="font-mono text-[10px] text-muted-foreground uppercase">
										Unit Cost
									</span>
									<span className="font-display text-xl font-bold text-primary drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]">
										${price.toFixed(2)}
									</span>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
									onClick={handleQuickView}>
									<Crosshair className="h-4 w-4" />
								</Button>
							</div>
						</CardFooter>
					</Card>
				</div>

				{/* Corner Accents (Absolute to the outer wrapper) */}
				{/* Top Left - Sharp */}
				<div className="absolute left-0 top-0 h-6 w-6 pointer-events-none">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-primary/50 transition-all duration-500 group-hover:text-primary group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
						<path d="M0 24 V 0 H 24" />
					</svg>
				</div>

				{/* Top Right - Cut */}
				<div className="absolute right-0 top-0 h-6 w-6 pointer-events-none">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-primary/50 transition-all duration-500 group-hover:text-primary group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
						<path d="M 0 0 H 14 L 24 10 V 24" />
					</svg>
				</div>

				{/* Bottom Right - Sharp */}
				<div className="absolute bottom-0 right-0 h-6 w-6 pointer-events-none">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-primary/50 transition-all duration-500 group-hover:text-primary group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
						<path d="M 0 24 H 24 V 0" />
					</svg>
				</div>

				{/* Bottom Left - Cut */}
				<div className="absolute bottom-0 left-0 h-6 w-6 pointer-events-none">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						className="text-primary/50 transition-all duration-500 group-hover:text-primary group-hover:drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">
						<path d="M 24 24 H 10 L 0 14 V 0" />
					</svg>
				</div>
			</div>
		</>
	);
}
