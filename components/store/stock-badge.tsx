"use client";

import { Package, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
	stock: number;
	className?: string;
	showIcon?: boolean;
}

export function StockBadge({
	stock,
	className,
	showIcon = true,
}: StockBadgeProps) {
	const isInStock = stock > 0;

	return (
		<Badge
			variant="outline"
			color={isInStock ? "success" : "destructive"}
			className={cn("font-mono", className)}>
			{showIcon &&
				(isInStock ? (
					<Package className="h-3.5 w-3.5" />
				) : (
					<AlertTriangle className="h-3.5 w-3.5" />
				))}
			<span>{isInStock ? "IN STOCK" : "OUT OF STOCK"}</span>
			{isInStock && stock <= 5 && (
				<span className="text-amber-400">({stock} left)</span>
			)}
		</Badge>
	);
}
