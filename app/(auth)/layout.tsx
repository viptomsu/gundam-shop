import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 min-h-screen bg-background">
			{/* Left Side: Form Section */}
			<div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
				{/* Background Decor */}
				<div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-10 dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] pointer-events-none" />

				{/* Back Button */}
				<div className="absolute top-8 left-8 md:top-12 md:left-12">
					<Button
						variant="ghost"
						className="-ml-4 text-muted-foreground hover:text-foreground group"
						asChild>
						<Link href="/">
							<ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
							<span className="hidden sm:inline">Back to Store</span>
							<span className="sr-only sm:hidden">Back</span>
						</Link>
					</Button>
				</div>

				<div className="mx-auto w-full max-w-[400px] space-y-6 relative z-10 animate-slide-down-fade">
					{/* Mobile/Form Logo */}
					<div className="flex justify-center mb-8 lg:mb-12">
						<Logo size="lg" />
					</div>
					{children}

					<div className="text-center text-xs text-muted-foreground mt-8">
						<p>SECURE CONNECTION ESTABLISHED</p>
						<p className="opacity-50">
							G-RETICLE SYSTEM V.{process.env.NEXT_PUBLIC_APP_VERSION}
						</p>
					</div>
				</div>
			</div>

			{/* Right Side: Visual Section with Hero Image */}
			<div className="hidden bg-muted lg:block relative overflow-hidden text-white border-l border-border/50">
				<Image
					src="/auth-hero.png"
					alt="Suit Hangar"
					fill
					className="object-cover opacity-90 grayscale-20 transition-transform duration-10000 hover:scale-105"
					priority
				/>
				{/* Tech Overlays */}
				<div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
				<div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] w-full h-full mix-blend-overlay" />

				{/* Content Overlay */}
				<div className="absolute bottom-0 left-0 p-12 z-20 w-full">
					<div className="border-l-4 border-primary pl-6 backdrop-blur-sm bg-background/30 p-4 rounded-r-lg max-w-lg">
						<h2 className="text-4xl font-display font-bold tracking-tighter mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
							READY FOR SORTIE
						</h2>
						<p className="text-gray-200 text-lg leading-relaxed">
							Access your pilot profile, manage orders, and customize your
							collection. The battlefield awaits.
						</p>
					</div>
					{/* Decorative Elements */}
					<div className="flex items-center gap-4 mt-8 opacity-70 font-mono text-xs">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
							<span>SERVER: ONLINE</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
							<span>PING: 12ms</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
