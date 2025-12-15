"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion, type LucideIcon } from "lucide-react";

interface NotFoundProps {
	title?: string;
	description?: string;
	linkText?: string;
	linkHref?: string;
	icon?: LucideIcon;
}

export function NotFound({
	title = "Page not found",
	description = "The page you are looking for does not exist or has been moved.",
	linkText = "Go back home",
	linkHref = "/",
	icon: Icon = FileQuestion,
}: NotFoundProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-6 animate-in fade-in-50">
			<div className="bg-muted p-4 rounded-full">
				<Icon className="h-12 w-12 text-muted-foreground" />
			</div>
			<div className="space-y-2 max-w-md">
				<h2 className="text-2xl font-bold tracking-tight">{title}</h2>
				<p className="text-muted-foreground">{description}</p>
			</div>
			<Button asChild variant="default" size="lg">
				<Link href={linkHref}>{linkText}</Link>
			</Button>
		</div>
	);
}
