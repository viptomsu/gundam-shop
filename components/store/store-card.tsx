import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreCardProps {
	title: string;
	description?: string | null;
	image?: string | null;
	href: string;
	count: number;
	countLabel: string;
	variant?: "primary" | "accent";
	containImage?: boolean; // For logos that shouldn't be covered
}

export function StoreCard({
	title,
	description,
	image,
	href,
	count,
	countLabel,
	variant = "primary",
	containImage = false,
}: StoreCardProps) {
	// Color variants mapping
	const colors = {
		primary: {
			border: "from-primary/30 via-primary/10 to-primary/30",
			shadow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]",
			badgeText: "text-primary/70",
			badgeBg: "bg-primary/10",
			textHover: "group-hover:text-primary",
			accent: "text-primary/40",
			accentHover: "group-hover:text-primary",
			grid: "rgba(6,182,212,0.1)",
		},
		accent: {
			border: "from-accent/30 via-accent/10 to-accent/30",
			shadow: "hover:shadow-[0_0_20px_rgba(255,215,0,0.3)]", // assuming goldish for accent
			badgeText: "text-accent/70",
			badgeBg: "bg-accent/10",
			textHover: "group-hover:text-accent",
			accent: "text-accent/40",
			accentHover: "group-hover:text-accent",
			grid: "rgba(255,215,0,0.1)",
		},
	};

	const theme = colors[variant];

	return (
		<Link href={href}>
			<div
				className={cn(
					"group relative h-48 overflow-hidden clip-mecha transition-all duration-300 hover:scale-[1.02]",
					theme.shadow
				)}>
				{/* Border wrapper */}
				<div
					className={cn(
						"absolute inset-0 bg-linear-to-br p-px clip-mecha",
						theme.border
					)}>
					<div className="absolute inset-px bg-card clip-mecha" />
				</div>

				{/* Background Image / Logo */}
				{image && (
					<div
						className={cn(
							"absolute inset-0 transition-all duration-500 group-hover:opacity-50",
							containImage
								? "flex items-center justify-center opacity-20 group-hover:opacity-40"
								: "bg-cover bg-center opacity-30 group-hover:scale-110"
						)}>
						{containImage ? (
							<div
								className="w-24 h-24 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
								style={{ backgroundImage: `url(${image})` }}
							/>
						) : (
							<div
								className="absolute inset-0 bg-cover bg-center"
								style={{ backgroundImage: `url(${image})` }}
							/>
						)}
					</div>
				)}

				{/* Gradient Overlay */}
				<div className="absolute inset-0 bg-linear-to-t from-background via-background/80 to-transparent z-10" />

				{/* Grid Pattern */}
				<div
					className="absolute inset-0 opacity-10 bg-size-[20px_20px] z-10"
					style={{
						backgroundImage: `linear-gradient(${theme.grid} 1px, transparent 1px), linear-gradient(90deg, ${theme.grid} 1px, transparent 1px)`,
					}}
				/>

				{/* Content */}
				<div className="relative z-20 h-full p-5 flex flex-col justify-end">
					{/* Product Count Badge */}
					<div
						className={cn(
							"absolute top-4 right-4 font-mono text-[10px] px-2 py-1 clip-mecha-sm",
							theme.badgeText,
							theme.badgeBg
						)}>
						{count} {countLabel}
					</div>

					{/* Title */}
					<h3
						className={cn(
							"font-display text-xl font-bold uppercase tracking-wide transition-colors",
							theme.textHover
						)}>
						{title}
					</h3>

					{/* Description */}
					{description && (
						<p className="text-sm text-muted-foreground line-clamp-1 mt-1">
							{description}
						</p>
					)}

					{/* Explore Indicator */}
					<div
						className={cn(
							"flex items-center gap-2 mt-3 transition-colors",
							variant === "primary" ? "text-primary/60" : "text-accent/60",
							theme.textHover
						)}>
						<div className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" />
						<span className="font-mono text-[10px] tracking-widest">
							EXPLORE
						</span>
						<ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
					</div>
				</div>

				{/* Corner Accents - Top Left */}
				<svg
					className={cn(
						"absolute top-2 left-2 w-4 h-4 transition-colors",
						theme.accent,
						theme.accentHover
					)}
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="2">
					<path d="M0 8 L0 0 L8 0" />
				</svg>

				{/* Corner Accents - Bottom Right */}
				<svg
					className={cn(
						"absolute bottom-2 right-2 w-4 h-4 transition-colors",
						theme.accent,
						theme.accentHover
					)}
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth="2">
					<path d="M16 8 L16 16 L8 16" />
				</svg>
			</div>
		</Link>
	);
}
