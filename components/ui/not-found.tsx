"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, type LucideIcon } from "lucide-react";

interface NotFoundProps {
	title?: string;
	description?: string;
	linkText?: string;
	linkHref?: string;
	icon?: LucideIcon;
	code?: string;
}

export function NotFound({
	title = "Page not found",
	description = "The page you are looking for does not exist or has been moved.",
	linkText = "Go back home",
	linkHref = "/",
	icon: Icon = AlertTriangle,
	code = "404",
}: NotFoundProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] w-full text-center p-8 animate-in fade-in-50 relative overflow-hidden">
			{/* Background grid effect */}
			<div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

			{/* Glow effect */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />

			<div className="relative z-10 space-y-8">
				{/* Error code with mecha styling */}
				<div className="relative">
					<div className="text-[120px] sm:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-primary/20 to-primary/5 font-display leading-none select-none">
						{code}
					</div>
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="relative p-1">
							<div className="absolute inset-0 bg-destructive/20 blur-sm animate-pulse" />
							<div className="relative bg-destructive/10 border border-destructive/50 p-4">
								<Icon className="h-12 w-12 sm:h-16 sm:w-16 text-destructive" />
							</div>
						</div>
					</div>
				</div>

				{/* Text content */}
				<div className="space-y-3 max-w-md mx-auto">
					<h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display uppercase">
						{title}
					</h1>
					<p className="text-muted-foreground text-sm sm:text-base">
						{description}
					</p>
				</div>

				{/* Primary action button */}
				<div className="pt-2">
					<Button asChild size="lg">
						<Link href={linkHref}>{linkText}</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
