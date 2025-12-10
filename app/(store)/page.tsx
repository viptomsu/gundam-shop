import { Hero } from "@/components/store/hero";
import { CategoryNav } from "@/components/store/category-nav";
import { NewArrivals } from "@/components/store/new-arrivals";

export const dynamic = "force-dynamic";

export default function StorePage() {
	return (
		<div className="flex flex-col gap-8 pb-20">
			<Hero />
			<CategoryNav />
			<NewArrivals />

			{/* Featured Banner (Static for now) */}
			<section className="container px-4 md:px-6 py-12">
				<div className="relative overflow-hidden rounded-lg border border-border bg-card">
					<div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-transparent z-10" />
					<div
						className="absolute inset-0 bg-cover bg-center opacity-50"
						style={{
							backgroundImage:
								"url('https://images.unsplash.com/photo-1596727147705-54a9d099308a?q=80&w=2070&auto=format&fit=crop')",
						}}
					/>
					<div className="relative z-20 p-8 md:p-12 max-w-2xl">
						<h2 className="text-3xl md:text-4xl font-bold font-display uppercase mb-4">
							Premium Bandai <span className="text-destructive">Exclusive</span>
						</h2>
						<p className="text-muted-foreground mb-6 text-lg">
							Limited edition kits available only for a short time. Secure your
							pre-order before they are gone forever.
						</p>
						{/* Reusing UI Button */}
						{/* Note: In a real implementation, we would import Button from @components/ui/button */}
						{/* But since this is inside the page, we can just use HTML or the Button component if imported */}
					</div>
				</div>
			</section>
		</div>
	);
}
