import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
	title: string;
	highlightedWord?: string;
	subtitle?: string;
	viewAllHref?: string;
	viewAllLabel?: string;
	className?: string;
}

export function SectionHeader({
	title,
	highlightedWord,
	subtitle,
	viewAllHref,
	viewAllLabel = "VIEW_ALL",
	className,
}: SectionHeaderProps) {
	// Split title to handle highlighted word
	const renderTitle = () => {
		if (!highlightedWord) {
			return title;
		}

		const parts = title.split(highlightedWord);
		if (parts.length === 1) {
			return title;
		}

		return (
			<>
				{parts[0]}
				<span className="text-primary">{highlightedWord}</span>
				{parts[1]}
			</>
		);
	};

	return (
		<div
			className={cn(
				"flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4",
				className
			)}>
			<div>
				<h2 className="text-2xl font-bold tracking-tighter font-display uppercase flex items-center gap-3">
					<span className="text-primary mr-1">///</span>
					{renderTitle()}
				</h2>
				{subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
			</div>

			{viewAllHref && (
				<Link
					href={viewAllHref}
					className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group">
					<span className="font-mono">{viewAllLabel}</span>
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Link>
			)}
		</div>
	);
}
