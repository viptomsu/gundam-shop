import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { Category } from "@prisma/client";

type CategoryWithCount = Category & {
	_count: {
		products: number;
	};
};

type ApiResponse = {
	data: CategoryWithCount[];
	meta: {
		total: number;
	};
};

export async function CategoryNav() {
	let categories: CategoryWithCount[] = [];

	try {
		const response = await fetchApi<ApiResponse>("/api/categories?limit=8", {
			next: { revalidate: 60 },
		});
		categories = response.data;
	} catch (error) {
		console.error("Failed to fetch categories:", error);
	}

	if (categories.length === 0) {
		return null;
	}

	return (
		<section className="container px-4 md:px-6 py-12">
			<div className="flex items-center justify-between mb-8">
				<h2 className="text-2xl font-bold tracking-tighter font-display uppercase">
					<span className="text-primary mr-2">///</span>
					Browse Categories
				</h2>
				<Link
					href="/categories"
					className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
					<span className="font-mono">VIEW_ALL</span>
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Link>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{categories.map((cat) => (
					<Link key={cat.id} href={`/category/${cat.slug}`}>
						<div className="group relative h-48 overflow-hidden clip-mecha transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
							{/* Border wrapper */}
							<div className="absolute inset-0 bg-linear-to-br from-primary/30 via-primary/10 to-primary/30 p-px clip-mecha">
								<div className="absolute inset-px bg-card clip-mecha" />
							</div>

							{/* Background Image */}
							{cat.image && (
								<div
									className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-500 group-hover:opacity-50 group-hover:scale-110"
									style={{ backgroundImage: `url(${cat.image})` }}
								/>
							)}

							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent z-10" />

							{/* Grid Pattern */}
							<div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-size-[20px_20px] z-10" />

							{/* Content */}
							<div className="relative z-20 h-full p-5 flex flex-col justify-end">
								{/* Product Count Badge */}
								<div className="absolute top-4 right-4 font-mono text-[10px] text-primary/70 bg-primary/10 px-2 py-1 clip-mecha-sm">
									{cat._count.products} ITEMS
								</div>

								{/* Category Name */}
								<h3 className="font-display text-xl font-bold uppercase tracking-wide group-hover:text-primary transition-colors">
									{cat.name}
								</h3>

								{/* Description */}
								{cat.description && (
									<p className="text-sm text-muted-foreground line-clamp-1 mt-1">
										{cat.description}
									</p>
								)}

								{/* Explore Indicator */}
								<div className="flex items-center gap-2 mt-3 text-primary/60 group-hover:text-primary transition-colors">
									<div className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
									<span className="font-mono text-[10px] tracking-widest">
										EXPLORE
									</span>
									<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
								</div>
							</div>

							{/* Corner Accents */}
							<svg
								className="absolute top-2 left-2 w-4 h-4 text-primary/40 group-hover:text-primary transition-colors"
								viewBox="0 0 16 16"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<path d="M0 8 L0 0 L8 0" />
							</svg>
							<svg
								className="absolute bottom-2 right-2 w-4 h-4 text-primary/40 group-hover:text-primary transition-colors"
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
