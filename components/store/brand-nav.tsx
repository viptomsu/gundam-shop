import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Brand } from "@prisma/client";
import { SectionHeader } from "./section-header";

type BrandWithCount = Brand & {
	_count: {
		products: number;
	};
};

type ApiResponse = {
	data: BrandWithCount[];
	meta: {
		total: number;
	};
};

export async function BrandNav() {
	let brands: BrandWithCount[] = [];

	try {
		const response = await fetchApi<ApiResponse>("/api/brands?limit=8", {
			next: { revalidate: 60 },
		});
		brands = response.data;
	} catch (error) {
		console.error("Failed to fetch brands:", error);
	}

	if (brands.length === 0) {
		return null;
	}

	return (
		<section className="container px-4 md:px-6 py-12">
			<SectionHeader title="Shop by Brand" viewAllHref="/brands" />

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{brands.map((brand) => (
					<Link key={brand.id} href={`/brands/${brand.slug}`}>
						<div className="group relative h-48 overflow-hidden clip-mecha transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
							{/* Border wrapper */}
							<div className="absolute inset-0 bg-linear-to-br from-accent/30 via-accent/10 to-accent/30 p-px clip-mecha">
								<div className="absolute inset-px bg-card clip-mecha" />
							</div>

							{/* Logo/Background Image */}
							{brand.logo && (
								<div className="absolute inset-0 flex items-center justify-center opacity-20 transition-all duration-500 group-hover:opacity-40">
									<div
										className="w-24 h-24 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
										style={{ backgroundImage: `url(${brand.logo})` }}
									/>
								</div>
							)}

							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent z-10" />

							{/* Grid Pattern */}
							<div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,215,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.1)_1px,transparent_1px)] bg-size-[20px_20px] z-10" />

							{/* Content */}
							<div className="relative z-20 h-full p-5 flex flex-col justify-end">
								{/* Product Count Badge */}
								<div className="absolute top-4 right-4 font-mono text-[10px] text-accent/70 bg-accent/10 px-2 py-1 clip-mecha-sm">
									{brand._count.products} PRODUCTS
								</div>

								{/* Brand Name */}
								<h3 className="font-display text-xl font-bold uppercase tracking-wide group-hover:text-accent transition-colors">
									{brand.name}
								</h3>

								{/* Description */}
								{brand.description && (
									<p className="text-sm text-muted-foreground line-clamp-1 mt-1">
										{brand.description}
									</p>
								)}

								{/* Explore Indicator */}
								<div className="flex items-center gap-2 mt-3 text-accent/60 group-hover:text-accent transition-colors">
									<div className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
									<span className="font-mono text-[10px] tracking-widest">
										VIEW ALL
									</span>
									<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
								</div>
							</div>

							{/* Corner Accents */}
							<svg
								className="absolute top-2 left-2 w-4 h-4 text-accent/40 group-hover:text-accent transition-colors"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<path d="M0 8 L0 0 L8 0" />
							</svg>
							<svg
								className="absolute bottom-2 right-2 w-4 h-4 text-accent/40 group-hover:text-accent transition-colors"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<path d="M16 8 L16 16 L8 16" />
							</svg>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
