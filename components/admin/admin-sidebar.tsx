"use client";

import { Logo } from "@/components/ui/logo";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import {
	Layers,
	LayoutDashboard,
	LogOut,
	Package,
	Settings,
	ShoppingBag,
	Store,
	Tags,
	Ticket,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		href: "/admin",
	},
	{
		label: "Products",
		icon: ShoppingBag,
		href: "/admin/products",
	},
	{
		label: "Orders",
		icon: Package,
		href: "/admin/orders",
	},
	{
		label: "Users",
		icon: Users,
		href: "/admin/users",
	},
	{
		label: "Brands",
		icon: Tags,
		href: "/admin/brands",
	},
	{
		label: "Categories",
		icon: Layers,
		href: "/admin/categories",
	},
	{
		label: "Series",
		icon: Layers,
		href: "/admin/series",
	},
	{
		label: "Vouchers",
		icon: Ticket,
		href: "/admin/vouchers",
	},
	{
		label: "Settings",
		icon: Settings,
		href: "/admin/settings",
	},
	{
		label: "Storefront",
		icon: Store,
		href: "/",
	},
];

export function AdminSidebar() {
	const pathname = usePathname();
	const { user } = useAuth();
	const logoutMutation = useLogout();

	const onLogout = () => {
		logoutMutation.mutate();
	};

	return (
		<div className="gap-4 flex flex-col h-full bg-[#111827] text-white">
			<div className="px-3 py-2 flex-1">
				<Logo
					href="/admin"
					className="pl-3 mt-4 mb-14"
					suffix={
						<span className="text-sm font-normal text-slate-400">Admin</span>
					}
				/>
				<div className="space-y-1">
					{routes.map((route) => (
						<Link
							key={route.href}
							href={route.href}
							className={cn(
								"text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-cyan-400 hover:bg-cyan-900/20 rounded-lg transition relative",
								pathname === route.href
									? "text-cyan-400 bg-cyan-900/20"
									: "text-slate-400"
							)}>
							{pathname === route.href && (
								<div className="absolute left-0 top-2 bottom-2 w-0.5 bg-cyan-400 rounded-r-full" />
							)}
							<div className="flex items-center flex-1">
								<route.icon
									className={cn(
										"h-5 w-5 mr-3",
										pathname === route.href
											? "text-cyan-400"
											: "text-slate-400 group-hover:text-cyan-400"
									)}
								/>
								{route.label}
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="px-3 py-2 border-t border-gray-800">
				{user && (
					<div className="flex items-center gap-x-3 p-3 bg-white/5 border border-white/10">
						<UserAvatar
							src={user.avatar}
							alt={user.name ?? user.email}
							size="md"
						/>
						<div className="flex flex-col flex-1 min-w-0">
							<p className="text-sm font-medium text-white truncate">
								{user.name ?? user.email}
							</p>
							<p className="text-xs text-zinc-400 truncate">{user.role}</p>
						</div>
						<button
							onClick={onLogout}
							className="p-2 hover:bg-white/10 transition-colors text-zinc-400 hover:text-red-500"
							title="Logout">
							<LogOut className="h-5 w-5" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
