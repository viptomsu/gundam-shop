import Link from "next/link";
import { Facebook, Instagram, Twitter, Github } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
	return (
		<footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
			<div className="container px-4 md:px-6 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Brand */}
					<div className="space-y-4">
						<Logo size="sm" />
						<p className="text-sm text-muted-foreground">
							Premium Gunpla store for hobbyists and collectors. Official Bandai
							retailer.
						</p>
					</div>

					{/* Links */}
					<div>
						<h3 className="font-bold mb-4 text-foreground uppercase tracking-wider text-sm">
							Shop
						</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/category/hg"
									className="hover:text-primary transition-colors">
									High Grade
								</Link>
							</li>
							<li>
								<Link
									href="/category/rg"
									className="hover:text-primary transition-colors">
									Real Grade
								</Link>
							</li>
							<li>
								<Link
									href="/category/mg"
									className="hover:text-primary transition-colors">
									Master Grade
								</Link>
							</li>
							<li>
								<Link
									href="/category/pg"
									className="hover:text-primary transition-colors">
									Perfect Grade
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold mb-4 text-foreground uppercase tracking-wider text-sm">
							Support
						</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/faq"
									className="hover:text-primary transition-colors">
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href="/shipping"
									className="hover:text-primary transition-colors">
									Shipping Info
								</Link>
							</li>
							<li>
								<Link
									href="/returns"
									className="hover:text-primary transition-colors">
									Returns
								</Link>
							</li>
							<li>
								<Link
									href="/contact"
									className="hover:text-primary transition-colors">
									Contact Us
								</Link>
							</li>
						</ul>
					</div>

					{/* Social */}
					<div>
						<h3 className="font-bold mb-4 text-foreground uppercase tracking-wider text-sm">
							Connect
						</h3>
						<div className="flex gap-4">
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors">
								<Facebook className="h-5 w-5" />
								<span className="sr-only">Facebook</span>
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors">
								<Instagram className="h-5 w-5" />
								<span className="sr-only">Instagram</span>
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors">
								<Twitter className="h-5 w-5" />
								<span className="sr-only">Twitter</span>
							</Link>
							<Link
								href="#"
								className="text-muted-foreground hover:text-primary transition-colors">
								<Github className="h-5 w-5" />
								<span className="sr-only">GitHub</span>
							</Link>
						</div>
					</div>
				</div>

				<div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-xs text-muted-foreground">
						&copy; {new Date().getFullYear()} G-Reticle. All rights reserved.
					</p>
					<div className="flex gap-4 text-xs text-muted-foreground">
						<Link href="/privacy" className="hover:text-foreground">
							Privacy Policy
						</Link>
						<Link href="/terms" className="hover:text-foreground">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
