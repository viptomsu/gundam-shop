import { Button } from "@/components/ui/button";
import { Search, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
	title?: string;
	message?: string;
	linkHref?: string;
	linkLabel?: string;
}

export function EmptyState({
	title = "No Units Found",
	message = "No mobile suits match your current search criteria. Try adjusting your filters.",
	linkHref = "/products",
	linkLabel = "BROWSE_ALL",
}: EmptyStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
				<Search className="h-8 w-8 text-muted-foreground" />
			</div>
			<h2 className="text-lg font-semibold mb-2">{title}</h2>
			<p className="text-sm text-muted-foreground max-w-md">{message}</p>
			<Button asChild variant="outline" className="mt-6">
				<Link href={linkHref}>{linkLabel}</Link>
			</Button>
		</div>
	);
}

interface ErrorStateProps {
	message?: string;
	retryHref?: string;
}

export function ErrorState({
	message = "Failed to load products. Please try again later.",
	retryHref = "/products",
}: ErrorStateProps) {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
				<AlertTriangle className="h-8 w-8 text-destructive" />
			</div>
			<h2 className="text-lg font-semibold mb-2">System Error</h2>
			<p className="text-sm text-muted-foreground max-w-md">{message}</p>
			<Button asChild className="mt-6">
				<Link href={retryHref}>RETRY_QUERY</Link>
			</Button>
		</div>
	);
}

export function FiltersSkeleton() {
	return (
		<div className="space-y-6 animate-pulse">
			<div className="h-8 bg-muted/50 rounded" />
			<div className="space-y-3">
				<div className="h-4 w-20 bg-muted/50 rounded" />
				<div className="space-y-2">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="flex items-center gap-2">
							<div className="h-5 w-5 bg-muted/50 rounded" />
							<div className="h-4 flex-1 bg-muted/50 rounded" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
