"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

interface FilterOption {
	id: string;
	name: string;
}

interface ProductFiltersProps {
	grades: FilterOption[];
	series: FilterOption[];
	brands: FilterOption[];
}

export function ProductFilters({
	grades,
	series,
	brands,
}: ProductFiltersProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Get current filter values from URL
	const currentGrades = searchParams.getAll("grade");
	const currentSeriesIds = searchParams.getAll("seriesId");
	const currentBrandIds = searchParams.getAll("brandId");

	const updateFilters = useCallback(
		(key: string, value: string, checked: boolean) => {
			const params = new URLSearchParams(searchParams.toString());

			// Remove page when filters change
			params.delete("page");

			if (checked) {
				params.append(key, value);
			} else {
				// Remove all instances of this key, then add back the ones we want
				const currentValues = params.getAll(key).filter((v) => v !== value);
				params.delete(key);
				currentValues.forEach((v) => params.append(key, v));
			}

			router.push(`/products?${params.toString()}`, { scroll: false });
		},
		[router, searchParams]
	);

	const clearFilters = useCallback(() => {
		// Keep only the search query if present
		const search = searchParams.get("search");
		const params = new URLSearchParams();
		if (search) {
			params.set("search", search);
		}
		router.push(`/products?${params.toString()}`, { scroll: false });
	}, [router, searchParams]);

	const hasActiveFilters =
		currentGrades.length > 0 ||
		currentSeriesIds.length > 0 ||
		currentBrandIds.length > 0;

	return (
		<div className="space-y-6">
			{/* Filter Header */}
			<div className="flex items-center justify-between pb-4 border-b border-border/50">
				<h3 className="font-mono text-sm uppercase tracking-wider text-primary flex items-center gap-2">
					<span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
					Filters
				</h3>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="h-7 text-xs font-mono text-muted-foreground hover:text-primary">
						<RotateCcw className="h-3 w-3 mr-1" />
						RESET
					</Button>
				)}
			</div>

			<Accordion
				type="multiple"
				defaultValue={["grade", "series", "brand"]}
				className="w-full">
				<AccordionItem value="grade" className="border-none">
					<AccordionTrigger className="hover:no-underline py-2">
						<span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
							Grade
						</span>
					</AccordionTrigger>
					<AccordionContent>
						<div className="space-y-2 pt-2">
							{grades.map((grade) => (
								<FilterCheckbox
									key={grade.id}
									id={`grade-${grade.id}`}
									label={grade.name}
									checked={currentGrades.includes(grade.id)}
									onCheckedChange={(checked) =>
										updateFilters("grade", grade.id, checked)
									}
								/>
							))}
						</div>
					</AccordionContent>
				</AccordionItem>

				{series.length > 0 && (
					<AccordionItem value="series" className="border-none">
						<AccordionTrigger className="hover:no-underline py-2">
							<span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
								Series
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-2 pt-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
								{series.map((s) => (
									<FilterCheckbox
										key={s.id}
										id={`series-${s.id}`}
										label={s.name}
										checked={currentSeriesIds.includes(s.id)}
										onCheckedChange={(checked) =>
											updateFilters("seriesId", s.id, checked)
										}
									/>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				)}

				{brands.length > 0 && (
					<AccordionItem value="brand" className="border-none">
						<AccordionTrigger className="hover:no-underline py-2">
							<span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
								Brand
							</span>
						</AccordionTrigger>
						<AccordionContent>
							<div className="space-y-2 pt-2">
								{brands.map((brand) => (
									<FilterCheckbox
										key={brand.id}
										id={`brand-${brand.id}`}
										label={brand.name}
										checked={currentBrandIds.includes(brand.id)}
										onCheckedChange={(checked) =>
											updateFilters("brandId", brand.id, checked)
										}
									/>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				)}
			</Accordion>
		</div>
	);
}

// Filter Checkbox Component
function FilterCheckbox({
	id,
	label,
	checked,
	onCheckedChange,
}: {
	id: string;
	label: string;
	checked: boolean;
	onCheckedChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center gap-2 group">
			<Checkbox
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				className="data-[state=checked]:border-primary"
			/>
			<Label
				htmlFor={id}
				className={cn(
					"text-sm font-mono cursor-pointer transition-colors",
					checked
						? "text-primary"
						: "text-muted-foreground group-hover:text-foreground"
				)}>
				{label}
			</Label>
		</div>
	);
}
