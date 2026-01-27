import Link from "next/link";
import { SectionHeader } from "./section-header";
import { fetchApi } from "@/lib/api";

type GradeWithCount = {
	label: string;
	value: string;
	count: number;
};

type ApiResponse = {
	data: GradeWithCount[];
};

export async function GradeList() {
	let grades: GradeWithCount[] = [];

	try {
		const response = await fetchApi<ApiResponse>("/api/grades", {
			next: { revalidate: 60 },
		});
		grades = response.data;
	} catch (error) {
		console.error("Failed to fetch grades:", error);
		// Fallback to empty or handled in UI if needed, but for now just empty array or maybe fallback?
		// We'll trust the API works for now, or if it fails, the section will be empty/hidden or show partial.
	}

	if (grades.length === 0) {
		return null;
	}

	return (
		<section className="container px-4 md:px-6 py-12 border-t border-border/40">
			<SectionHeader title="Filter By Grade" />

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
				{grades.map((grade) => (
					<Link
						key={grade.value}
						href={`/products?grade=${grade.value}`}
						className="group relative overflow-hidden bg-card border border-border/50 p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-md">
						{/* Hover Background Effect */}
						<div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

						{/* Content */}
						<div className="relative z-10 flex flex-col h-full justify-between gap-2">
							<div className="flex items-start justify-between">
								<span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors">
									[{grade.value}]
								</span>
								<div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30 group-hover:bg-primary group-hover:shadow-[0_0_5px_rgba(6,182,212,0.8)] transition-all duration-300" />
							</div>

							<div className="font-bold text-sm leading-tight group-hover:text-foreground transition-colors">
								{grade.label.split(" (")[0]}
							</div>

							<div className="text-xs text-muted-foreground group-hover:text-primary/80 transition-colors mt-auto pt-2">
								{grade.count} products
							</div>
						</div>

						<div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-br-md" />
					</Link>
				))}
			</div>
		</section>
	);
}
