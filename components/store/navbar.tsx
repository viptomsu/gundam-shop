"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { selectTotalItems, useCartStore } from "@/store/cart";
import { LogIn, Search, ShoppingCart, UserPlus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/logo";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { UserAvatar } from "@/components/ui/user-avatar";
import { SearchBar } from "./search-bar";

export function Navbar() {
	const totalItems = useCartStore(selectTotalItems);
	const setCartOpen = useCartStore((state) => state.setOpen);
	const { user, isLoading } = useAuth();
	const { mutate: logout } = useLogout();
	const [searchOpen, setSearchOpen] = useState(false);

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
			<div className="container flex h-16 items-center justify-between px-4 md:px-6">
				{/* Logo */}
				<Logo textClassName="hidden sm:block" />

				{/* Search Bar - Desktop */}
				<SearchBar />

				{/* Actions */}
				<div className="flex items-center justify-end gap-2 md:gap-4">
					{/* Mobile Search Trigger */}
					<Sheet open={searchOpen} onOpenChange={setSearchOpen}>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Search className="h-5 w-5" />
								<span className="sr-only">Search</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="top" className="w-full">
							<SheetHeader>
								<SheetTitle>Search Products</SheetTitle>
							</SheetHeader>
							<div className="py-4 px-4">
								<SearchBar
									className="block w-full max-w-none mx-0"
									onSearchSelect={() => setSearchOpen(false)}
								/>
							</div>
						</SheetContent>
					</Sheet>

					{/* Cart */}
					<div className="relative">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setCartOpen(true)}>
							<ShoppingCart className="h-5 w-5" />
							<span className="sr-only">Cart</span>
						</Button>
						{totalItems > 0 && (
							<Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-primary text-primary-foreground text-[10px] pointer-events-none">
								{totalItems > 99 ? "99+" : totalItems}
							</Badge>
						)}
					</div>

					{/* User Menu */}
					{!isLoading && !user ? (
						<div className="flex items-center gap-2">
							{/* Login */}
							<Button variant="ghost" size="icon" className="md:hidden" asChild>
								<Link href="/login" aria-label="Login">
									<LogIn className="h-4 w-4" />
								</Link>
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className="hidden md:inline-flex"
								asChild>
								<Link href="/login">
									<LogIn className="h-4 w-4 mr-2" />
									Login
								</Link>
							</Button>

							{/* Register */}
							<Button size="icon" className="md:hidden" asChild>
								<Link href="/register" aria-label="Register">
									<UserPlus className="h-4 w-4" />
								</Link>
							</Button>
							<Button size="sm" className="hidden md:inline-flex" asChild>
								<Link href="/register">
									<UserPlus className="h-4 w-4 mr-2" />
									Register
								</Link>
							</Button>
						</div>
					) : user ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									size="icon"
									className="p-0 rounded-none">
									<UserAvatar
										src={user.avatar}
										alt={user.name ?? user.email}
										size="sm"
									/>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-56">
								<DropdownMenuLabel>
									<div className="flex flex-col">
										<span>{user.name ?? user.email}</span>
										<span className="text-xs text-muted-foreground font-normal">
											{user.role === "ADMIN" ? "Administrator" : "Member"}
										</span>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem asChild>
									<Link href="/account/profile">Profile</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link href="/account/orders">Orders</Link>
								</DropdownMenuItem>
								{user.role === "ADMIN" && (
									<DropdownMenuItem asChild>
										<Link href="/admin">Admin Dashboard</Link>
									</DropdownMenuItem>
								)}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant="destructive"
									className="cursor-pointer"
									onClick={() => logout()}>
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : null}
				</div>
			</div>

			{/* Decorative Bottom Line */}
			<div className="absolute bottom-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
		</header>
	);
}
