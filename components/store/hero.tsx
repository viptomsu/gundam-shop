import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Hero3DViewer } from "./hero-3d-viewer";

export function Hero() {
	return (
		<section className="relative min-h-[600px] w-full overflow-hidden border-b border-border bg-background">
			{/* Background Image / Effect */}
			<div className="absolute inset-0 z-0">
				<div className="absolute inset-0 bg-linear-to-r from-background via-background/90 to-background/40 z-10" />
				<div
					className="h-full w-full bg-cover bg-center opacity-50"
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1578374173705-969cdd6c2d24?q=80&w=2070&auto=format&fit=crop')",
					}}
				/>
			</div>

			{/* Content Grid */}
			<div className="container relative z-20 flex h-full flex-col justify-center px-4 md:px-6 py-12 md:py-0">
				<div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center h-full">
					{/* Left Column: Text */}
					<div className="flex flex-col justify-center space-y-6 max-w-2xl">
						<div className="inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur-sm w-fit">
							<span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
							New Arrival: MGEX Strike Freedom
						</div>

						<h1 className="text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl font-display uppercase text-transparent bg-clip-text bg-linear-to-r from-white to-white/60">
							Build Your <br />
							<span className="text-primary">Ultimate Mecha</span>
						</h1>

						<p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
							Discover the finest collection of Gunpla, from High Grade to
							Perfect Grade. Precision engineering meets artistic expression.
						</p>

						<div className="flex flex-col gap-2 min-[400px]:flex-row">
							<Button
								size="lg"
								className="gap-2 clip-mecha bg-primary text-primary-foreground hover:bg-primary/90">
								Shop Now <ArrowRight className="h-4 w-4" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="clip-mecha border-primary/50 text-primary hover:bg-primary/10">
								View Collection
							</Button>
						</div>
					</div>

					{/* Right Column: 3D Viewer */}
					<div className="h-[400px] w-full lg:h-[600px] relative">
						{/* 3D Viewer Component */}
						<Hero3DViewer />

						{/* Decorative Overlay for 3D area */}
						<div className="absolute top-0 right-0 p-4 pointer-events-none">
							<div className="flex flex-col items-end gap-1 text-[10px] text-primary/60 font-mono">
								<span>VIEWER.MOD: ACTIVE</span>
								<span>ROTATION: ENABLED</span>
								<span>ZOOM: ENABLED</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
