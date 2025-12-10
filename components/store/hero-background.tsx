"use client";

import { useEffect, useState } from "react";

export function HeroBackground() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{/* Base gradient overlay */}
			<div className="absolute inset-0 bg-linear-to-br from-background via-background/95 to-background/80 z-10" />

			{/* Hex grid pattern */}
			<div
				className="absolute inset-0 opacity-20"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5L55 20V40L30 55L5 40V20L30 5Z' fill='none' stroke='%2306b6d4' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Animated scan line - REMOVED */}
			{/* <div className="absolute inset-0 z-20">
				<div className="h-[2px] w-full bg-linear-to-r from-transparent via-primary/50 to-transparent animate-scan-vertical" />
			</div> */}

			{/* Floating particles */}
			<div className="absolute inset-0 z-5">
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className="absolute rounded-full bg-primary/30 animate-float-particle"
						style={{
							width: `${Math.random() * 4 + 2}px`,
							height: `${Math.random() * 4 + 2}px`,
							left: `${Math.random() * 100}%`,
							top: `${Math.random() * 100}%`,
							animationDelay: `${Math.random() * 5}s`,
							animationDuration: `${Math.random() * 10 + 10}s`,
						}}
					/>
				))}
			</div>

			{/* Corner accent lines */}
			<svg
				className="absolute top-0 left-0 w-32 h-32 text-primary/30"
				viewBox="0 0 128 128"
				fill="none">
				<path
					d="M0 40 L0 0 L40 0"
					stroke="currentColor"
					strokeWidth="2"
					className="animate-draw-line"
				/>
				<path
					d="M0 60 L0 20 L60 20"
					stroke="currentColor"
					strokeWidth="1"
					opacity="0.5"
				/>
			</svg>

			<svg
				className="absolute top-0 right-0 w-32 h-32 text-primary/30"
				viewBox="0 0 128 128"
				fill="none">
				<path
					d="M128 40 L128 0 L88 0"
					stroke="currentColor"
					strokeWidth="2"
					className="animate-draw-line"
				/>
				<path
					d="M128 60 L128 20 L68 20"
					stroke="currentColor"
					strokeWidth="1"
					opacity="0.5"
				/>
			</svg>

			<svg
				className="absolute bottom-0 left-0 w-32 h-32 text-primary/30"
				viewBox="0 0 128 128"
				fill="none">
				<path
					d="M0 88 L0 128 L40 128"
					stroke="currentColor"
					strokeWidth="2"
					className="animate-draw-line"
				/>
			</svg>

			<svg
				className="absolute bottom-0 right-0 w-32 h-32 text-primary/30"
				viewBox="0 0 128 128"
				fill="none">
				<path
					d="M128 88 L128 128 L88 128"
					stroke="currentColor"
					strokeWidth="2"
					className="animate-draw-line"
				/>
			</svg>

			{/* Gradient orbs for depth */}
			<div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
			<div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000" />
		</div>
	);
}
