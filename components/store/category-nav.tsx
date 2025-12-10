import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

import { GUNDAM_GRADES } from "@/config/constants";

const GRADE_STYLES: Record<
	string,
	{ description: string; color: string; bg: string }
> = {
	HG: {
		description: "1/144 Scale",
		color: "border-blue-500/50 hover:border-blue-500",
		bg: "from-blue-500/5 to-transparent",
	},
	RG: {
		description: "1/144 Scale (Advanced)",
		color: "border-emerald-500/50 hover:border-emerald-500",
		bg: "from-emerald-500/5 to-transparent",
	},
	MG: {
		description: "1/100 Scale",
		color: "border-amber-500/50 hover:border-amber-500",
		bg: "from-amber-500/5 to-transparent",
	},
	PG: {
		description: "1/60 Scale",
		color: "border-red-500/50 hover:border-red-500",
		bg: "from-red-500/5 to-transparent",
	},
};

const categories = GUNDAM_GRADES.filter((grade) =>
	Object.keys(GRADE_STYLES).includes(grade.value)
).map((grade) => ({
	title: grade.label.split(" (")[0], // Extract "High Grade" from "High Grade (HG)"
	slug: grade.value.toLowerCase(),
	...GRADE_STYLES[grade.value],
}));

export function CategoryNav() {
	return (
		<section className="container px-4 md:px-6 py-12">
			<div className="flex items-center justify-between mb-8">
				<h2 className="text-2xl font-bold tracking-tighter font-display uppercase">
					<span className="text-primary mr-2">///</span>
					Select Grade
				</h2>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{categories.map((cat) => (
					<Link key={cat.slug} href={`/category/${cat.slug}`}>
						<Card
							className={`h-full transition-all duration-300 border bg-linear-to-br ${cat.bg} ${cat.color} hover:shadow-lg hover:shadow-primary/5 group overflow-hidden relative`}>
							<CardContent className="p-6 flex flex-col justify-between h-full relative z-10">
								<div>
									<h3 className="font-bold text-xl mb-1 group-hover:text-foreground transition-colors">
										{cat.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{cat.description}
									</p>
								</div>
								<div className="mt-4 flex justify-end">
									<div className="h-1 w-8 bg-muted-foreground/30 group-hover:w-16 group-hover:bg-primary transition-all duration-300" />
								</div>
							</CardContent>

							{/* Tech Pattern Overlay */}
							<div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-size-[16px_16px]" />
						</Card>
					</Link>
				))}
			</div>
		</section>
	);
}
