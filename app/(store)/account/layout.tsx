"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, User, LogOut, ChevronRight } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sidebarLinks = [
	{
		href: "/account/profile",
		label: "Profile",
		icon: User,
	},
	{
		href: "/account/orders",
		label: "My Orders",
		icon: Package,
	},
];

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const { user, isLoading } = useAuth();
	const { mutate: logout } = useLogout();

	// Show loading skeleton
	if (isLoading) {
		return (
			<div className="container py-8">
				<div className="flex gap-8 animate-pulse">
					<div className="hidden md:block w-64 h-96 bg-card/50 rounded" />
					<div className="flex-1 h-96 bg-card/50 rounded" />
				</div>
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!user) {
		return (
			<div className="container py-16 text-center">
				<div className="max-w-md mx-auto space-y-4">
					<Package className="h-16 w-16 mx-auto text-muted-foreground" />
					<h2 className="text-2xl font-bold">Access Restricted</h2>
					<p className="text-muted-foreground">
						Please log in to access your account dashboard.
					</p>
					<Button asChild>
						<Link href="/login">Login to Continue</Link>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="container py-8">
			<div className="flex flex-col md:flex-row gap-8">
				{/* Sidebar - Desktop */}
				<aside className="hidden md:block w-64 shrink-0">
					<div className="sticky top-24">
						{/* User Header */}
						<div className="p-4 border border-border/50 bg-card/30 clip-mecha mb-4">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-primary/20 border border-primary/30 flex items-center justify-center clip-mecha-sm">
									<User className="h-5 w-5 text-primary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-medium text-sm truncate">
										{user.name ?? user.email}
									</p>
									<p className="text-xs text-muted-foreground font-mono">
										{user.role === "ADMIN" ? ">> ADMIN" : ">> PILOT"}
									</p>
								</div>
							</div>
						</div>

						{/* Navigation */}
						<nav className="border border-border/50 bg-card/30 p-2 space-y-1 clip-mecha">
							<div className="px-3 py-2 text-xs text-muted-foreground font-mono uppercase tracking-wider border-b border-border/30 mb-2">
								Navigation
							</div>
							{sidebarLinks.map((link) => {
								const isActive = pathname === link.href;
								return (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											"flex items-center gap-3 px-3 py-2 text-sm transition-colors group",
											isActive
												? "bg-primary/10 text-primary border-l-2 border-primary"
												: "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
										)}>
										<link.icon className="h-4 w-4" />
										<span className="flex-1">{link.label}</span>
										{isActive && (
											<ChevronRight className="h-4 w-4 opacity-50" />
										)}
									</Link>
								);
							})}

							<div className="pt-2 border-t border-border/30 mt-2">
								<button
									onClick={() => logout()}
									className="flex items-center gap-3 px-3 py-2 text-sm w-full text-destructive hover:bg-destructive/10 transition-colors">
									<LogOut className="h-4 w-4" />
									<span>Logout</span>
								</button>
							</div>
						</nav>

						{/* Decorative Element */}
						<div className="mt-4 p-3 border border-border/30 bg-card/20 text-xs font-mono text-muted-foreground">
							<div className="flex items-center gap-2 mb-1">
								<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
								<span>SYSTEM ONLINE</span>
							</div>
							<p className="opacity-60">
								ID: {user.id.slice(0, 8).toUpperCase()}
							</p>
						</div>
					</div>
				</aside>

				{/* Mobile Navigation */}
				<div className="md:hidden flex gap-2 overflow-x-auto pb-2">
					{sidebarLinks.map((link) => {
						const isActive = pathname === link.href;
						return (
							<Link
								key={link.href}
								href={link.href}
								className={cn(
									"flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap border transition-colors",
									isActive
										? "bg-primary/10 text-primary border-primary"
										: "bg-card/30 text-muted-foreground border-border/50 hover:text-foreground"
								)}>
								<link.icon className="h-4 w-4" />
								{link.label}
							</Link>
						);
					})}
				</div>

				{/* Main Content */}
				<main className="flex-1 min-w-0">{children}</main>
			</div>
		</div>
	);
}
