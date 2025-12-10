import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crosshair, Radio, Wifi, Zap } from "lucide-react";
import { Hero3DViewer } from "./hero-3d-viewer";
import { HeroBackground } from "./hero-background";
import { Badge } from "../ui/badge";

export function Hero() {
	return (
		<section className="relative min-h-[700px] w-full overflow-hidden border-b border-border bg-background">
			{/* Animated Background */}
			<HeroBackground />

			{/* Content Grid */}
			<div className="container relative z-20 flex h-full flex-col justify-center px-4 md:px-6 py-12 md:py-0">
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center min-h-[600px]">
					{/* Left Column: Text */}
					<div className="flex flex-col justify-center space-y-6 max-w-2xl">
						{/* Status Badge */}
						<Badge
							variant="outline"
							className="font-mono text-xs tracking-wider">
							SYSTEM.STATUS: ONLINE
						</Badge>

						{/* Main Headline with animated effect */}
						<div className="space-y-2">
							<h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl font-display uppercase">
								<span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-white/60">
									Build Your
								</span>
								<br />
								<span className="text-primary relative inline-block">
									Ultimate Mecha
									{/* Glitch overlay effect */}
									<span
										className="absolute inset-0 text-accent opacity-0 hover:opacity-100 hover:animate-glitch"
										aria-hidden="true">
										Ultimate Mecha
									</span>
								</span>
							</h1>
						</div>

						{/* Subheadline */}
						<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-light">
							Discover the finest collection of Gunpla, from High Grade to
							Perfect Grade.{" "}
							<span className="text-primary">Precision engineering</span> meets{" "}
							<span className="text-primary">artistic expression</span>.
						</p>

						{/* Stats Row */}
						<div className="flex gap-6 py-4 border-y border-border/50">
							<div className="flex items-center gap-2">
								<Zap className="h-4 w-4 text-accent" />
								<div>
									<p className="text-2xl font-bold font-display">500+</p>
									<p className="text-xs text-muted-foreground font-mono">
										MODELS
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Radio className="h-4 w-4 text-primary" />
								<div>
									<p className="text-2xl font-bold font-display">4</p>
									<p className="text-xs text-muted-foreground font-mono">
										GRADES
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Wifi className="h-4 w-4 text-primary" />
								<div>
									<p className="text-2xl font-bold font-display">24/7</p>
									<p className="text-xs text-muted-foreground font-mono">
										SUPPORT
									</p>
								</div>
							</div>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col gap-3 min-[400px]:flex-row">
							<Button size="lg" className="gap-2 group" asChild>
								<Link href="/products">
									<span className="font-mono text-sm">INIT_DEPLOY</span>
									<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="/categories">
									<span className="font-mono text-sm">VIEW_ARSENAL</span>
								</Link>
							</Button>
						</div>
					</div>

					{/* Right Column: 3D Viewer with HUD */}
					<div className="h-[400px] w-full lg:h-[600px] relative">
						{/* HUD Frame */}
						<div className="absolute inset-0 pointer-events-none z-30">
							{/* Top bracket */}
							<div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2">
								<div className="h-[2px] w-8 bg-primary/50" />
								<span className="font-mono text-[10px] text-primary/70 tracking-widest">
									3D_VIEWER.MOD
								</span>
								<div className="h-[2px] w-8 bg-primary/50" />
							</div>

							{/* Corner brackets */}
							<svg
								className="absolute top-2 left-2 w-8 h-8 text-primary/70"
								viewBox="0 0 32 32"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<path d="M0 12 L0 0 L12 0" />
							</svg>
							<svg
								className="absolute top-2 right-2 w-8 h-8 text-primary/70"
								viewBox="0 0 32 32"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<path d="M32 12 L32 0 L20 0" />
							</svg>
							<svg
								className="absolute bottom-2 left-2 w-8 h-8 text-primary/70"
								viewBox="0 0 32 32"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<path d="M0 20 L0 32 L12 32" />
							</svg>
							<svg
								className="absolute bottom-2 right-2 w-8 h-8 text-primary/70"
								viewBox="0 0 32 32"
								fill="none"
								stroke="currentColor"
								strokeWidth="2">
								<path d="M32 20 L32 32 L20 32" />
							</svg>

							{/* Targeting reticle */}
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32">
								<svg
									className="w-full h-full text-primary/20 animate-target-spin"
									viewBox="0 0 128 128"
									fill="none"
									stroke="currentColor"
									strokeWidth="1">
									<circle cx="64" cy="64" r="60" strokeDasharray="8 8" />
								</svg>
							</div>

							{/* Data readouts - Left side */}
							<div className="absolute left-4 top-1/3 flex flex-col gap-1 text-[10px] text-primary/60 font-mono">
								<span>SYS: ACTIVE</span>
								<span>PWR: 100%</span>
								<span className="text-accent">ROT: ENABLED</span>
							</div>

							{/* Data readouts - Right side */}
							<div className="absolute right-4 top-1/3 flex flex-col gap-1 text-[10px] text-primary/60 font-mono text-right">
								<span>ZOOM: 1.0x</span>
								<span>FPS: 60</span>
								<span className="text-accent">DRAG TO ROTATE</span>
							</div>

							{/* Bottom info bar */}
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
								<span className="flex items-center gap-1">
									<Crosshair className="h-3 w-3 text-primary" />
									INTERACTIVE
								</span>
								<span className="h-3 w-px bg-border" />
								<span>RX-0 UNICORN</span>
							</div>
						</div>

						{/* 3D Viewer Component */}
						<Hero3DViewer />
					</div>
				</div>
			</div>
		</section>
	);
}
