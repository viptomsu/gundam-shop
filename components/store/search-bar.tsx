"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";

interface Product {
	id: string;
	name: string;
	slug: string;
	minPrice: number;
	images: string[];
	brand?: { name: string };
	series?: { name: string };
}

export function SearchBar() {
	const router = useRouter();
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const [results, setResults] = React.useState<Product[]>([]);
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		const timer = setTimeout(async () => {
			if (query.trim().length === 0) {
				setResults([]);
				return;
			}

			setLoading(true);
			try {
				const res = await fetch(
					`/api/products?search=${encodeURIComponent(query)}&limit=5`
				);
				const data = await res.json();
				if (data.data) {
					setResults(data.data);
					setOpen(true);
				}
			} catch (error) {
				console.error("Search error:", error);
			} finally {
				setLoading(false);
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [query]);

	const handleSelect = (product: Product) => {
		setOpen(false);
		router.push(`/products/${product.slug}`);
	};

	return (
		<div className="relative z-50 w-full max-w-md mx-6 hidden md:block">
			<Command shouldFilter={false} className="bg-transparent overflow-visible">
				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground z-10" />
					<CommandPrimitive.Input
						value={query}
						onValueChange={setQuery}
						onKeyDown={(e) => {
							if (e.key === "Enter" && results.length === 0) {
								router.push(`/products?search=${encodeURIComponent(query)}`);
							}
						}}
						onFocus={() => {
							if (results.length > 0) setOpen(true);
						}}
						onBlur={() => {
							setTimeout(() => setOpen(false), 200);
						}}
						placeholder="Search mobile suits..."
						className="flex h-10 w-full rounded-md border border-border/50 bg-secondary/50 pl-9 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 tech-input-base"
					/>
				</div>

				{open && results.length > 0 && (
					<div className="absolute top-full mt-2 w-full rounded-md border border-primary/20 bg-secondary/95 backdrop-blur-sm text-popover-foreground shadow-2xl shadow-primary/10 animate-in fade-in-0 zoom-in-95 z-50">
						<CommandList>
							{results.map((product) => (
								<CommandItem
									key={product.id}
									onSelect={() => handleSelect(product)}
									// Removed manual styling matching select, leveraging CommandItem default using data-selected from ui/command
									className="cursor-pointer">
									<div className="flex items-center gap-3 w-full">
										<div className="relative h-10 w-10 overflow-hidden rounded-md border border-border bg-secondary/20">
											{product.images[0] ? (
												<Image
													src={product.images[0]}
													alt={product.name}
													fill
													className="object-cover"
												/>
											) : (
												<div className="flex bg-muted h-full w-full items-center justify-center">
													<Search className="h-4 w-4 text-muted-foreground/50" />
												</div>
											)}
										</div>
										<div className="flex flex-col flex-1 gap-0.5 overflow-hidden">
											<span className="font-medium truncate text-white">
												{product.name}
											</span>
											<div className="flex items-center gap-2 text-xs text-muted-foreground">
												{product.series && <span>{product.series.name}</span>}
												{product.brand && (
													<>
														<span className="text-border">|</span>
														<span>{product.brand.name}</span>
													</>
												)}
											</div>
										</div>
										<div className="font-mono text-xs text-primary">
											${product.minPrice.toFixed(2)}
										</div>
									</div>
								</CommandItem>
							))}
						</CommandList>
					</div>
				)}
			</Command>
		</div>
	);
}
