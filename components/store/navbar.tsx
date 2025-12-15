"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import { useCartStore, selectTotalItems } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function Navbar() {
	const totalItems = useCartStore(selectTotalItems);
	const setCartOpen = useCartStore((state) => state.setOpen);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
			<div className="container flex h-16 items-center justify-between px-4 md:px-6">
				{/* Logo */}
				<div className="flex items-center gap-2">
					<Link href="/" className="flex items-center gap-2">
						<div>
							<Image src="/logo-eye.png" alt="Logo" width={40} height={40} />
						</div>
						<span className="text-xl font-bold tracking-tighter font-display uppercase hidden sm:block">
							Gundam<span className="text-primary">Shop</span>
						</span>
					</Link>
				</div>

				{/* Search Bar - Desktop */}
				<div className="hidden md:flex items-center flex-1 max-w-md mx-6">
					<div className="relative w-full">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search mobile suits..."
							className="w-full pl-9 bg-secondary/50 border-border/50 focus-visible:ring-primary/50 tech-input-base"
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex items-center gap-4">
					{/* Mobile Search Trigger */}
					<Button variant="ghost" size="icon" className="md:hidden">
						<Search className="h-5 w-5" />
						<span className="sr-only">Search</span>
					</Button>

					{/* Cart */}
					<Button
						variant="ghost"
						size="icon"
						className="relative"
						onClick={() => setCartOpen(true)}>
						<ShoppingCart className="h-5 w-5" />
						{totalItems > 0 && (
							<Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px]">
								{totalItems > 99 ? "99+" : totalItems}
							</Badge>
						)}
						<span className="sr-only">Cart</span>
					</Button>

					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon" className="rounded-full">
								<Avatar className="h-8 w-8 border border-border">
									<AvatarImage src="/placeholder-user.jpg" alt="@user" />
									<AvatarFallback>U</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Orders</DropdownMenuItem>
							<DropdownMenuItem>Settings</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-destructive">
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{/* Decorative Bottom Line */}
			<div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
		</header>
	);
}
