"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	ShoppingBag,
	Package,
	Users,
	Tags,
	Ticket,
	Settings,
	LogOut,
	UserCircle,
	Layers,
} from "lucide-react";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const routes = [
	{
		label: "Dashboard",
		icon: LayoutDashboard,
		href: "/admin",
		color: "text-sky-500",
	},
	{
		label: "Products",
		icon: ShoppingBag,
		href: "/admin/products",
		color: "text-violet-500",
	},
	{
		label: "Orders",
		icon: Package,
		href: "/admin/orders",
		color: "text-pink-700",
	},
	{
		label: "Users",
		icon: Users,
		href: "/admin/users",
		color: "text-orange-700",
	},
	{
		label: "Brands",
		icon: Tags,
		href: "/admin/brands",
		color: "text-emerald-500",
	},
	{
		label: "Categories",
		icon: Layers,
		href: "/admin/categories",
		color: "text-cyan-500",
	},
	{
		label: "Vouchers",
		icon: Ticket,
		href: "/admin/vouchers",
		color: "text-green-700",
	},
	{
		label: "Settings",
		icon: Settings,
		href: "/admin/settings",
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
				<Link href="/admin" className="flex items-center pl-3 mt-4 mb-14">
					<div className="relative w-8 h-8 mr-4">
						{/* Placeholder for logo if needed */}
						<div className="absolute fill-white font-bold text-2xl">G</div>
					</div>
					<h1 className="text-2xl font-bold">Gundam Admin</h1>
				</Link>
				<div className="space-y-1">
					{routes.map((route) => (
						<Link
							key={route.href}
							href={route.href}
							className={cn(
								"text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
								pathname === route.href
									? "text-white bg-white/10"
									: "text-zinc-400"
							)}>
							<div className="flex items-center flex-1">
								<route.icon className={cn("h-5 w-5 mr-3", route.color)} />
								{route.label}
							</div>
						</Link>
					))}
				</div>
			</div>
			<div className="px-3 py-2 border-t border-gray-800">
				{user && (
					<div className="flex items-center gap-x-3 p-3 rounded-lg bg-white/5 border border-white/10">
						<Avatar className="h-10 w-10">
							<AvatarFallback className="bg-sky-500 text-white font-bold">
								{user.username?.[0]?.toUpperCase() || "U"}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col flex-1 min-w-0">
							<p className="text-sm font-medium text-white truncate">
								{user.username}
							</p>
							<p className="text-xs text-zinc-400 truncate">{user.role}</p>
						</div>
						<button
							onClick={onLogout}
							className="p-2 hover:bg-white/10 rounded-md transition-colors text-zinc-400 hover:text-red-500"
							title="Logout">
							<LogOut className="h-5 w-5" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
