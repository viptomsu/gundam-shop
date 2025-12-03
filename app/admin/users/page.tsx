"use client";

import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
	MoreHorizontal,
	Shield,
	ShieldAlert,
	Ban,
	CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/ui/pagination";
import { toast } from "sonner";
import { useUrlParams } from "@/hooks/use-url-params";
import { SearchInput } from "@/components/ui/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatShortDate } from "@/utils/format";
import { User, Role } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toggleUserBan, updateUserRole } from "@/app/actions/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUsers } from "@/hooks/useUsers";

export default function UsersPage() {
	const [params, setParams] = useUrlParams({
		page: 1,
		limit: 10,
		search: "",
		role: "" as Role | "",
	});
	const queryClient = useQueryClient();
	const confirm = useConfirm();

	// Fetch Users via Hook (API Route)
	const { data: usersData, isLoading } = useUsers({
		page: params.page,
		limit: params.limit,
		search: params.search,
		role: params.role || undefined,
	});

	// Server Actions Mutations
	const toggleBanMutation = useMutation({
		mutationFn: async (user: User) => {
			const res = await toggleUserBan(user.id);
			if (!res.success) throw new Error(res.error);
			return res;
		},
		onSuccess: (data, user) => {
			toast.success(user.isBanned ? "User unbanned" : "User banned");
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (err) => {
			toast.error("Failed to update ban status");
		},
	});

	const updateRoleMutation = useMutation({
		mutationFn: async ({ user, newRole }: { user: User; newRole: Role }) => {
			const res = await updateUserRole(user.id, newRole);
			if (!res.success) throw new Error(res.error);
			return res;
		},
		onSuccess: (data, vars) => {
			toast.success(`User role updated to ${vars.newRole}`);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (err) => {
			toast.error("Failed to update role");
		},
	});

	const columns: ColumnDef<User>[] = [
		{
			accessorKey: "info",
			header: "User Info",
			cell: ({ row }) => {
				const user = row.original;
				return (
					<div className="flex items-center gap-3">
						<Avatar className="h-9 w-9 rounded-md border">
							<AvatarImage src={user.avatar || ""} alt={user.name || ""} />
							<AvatarFallback className="rounded-md">
								{user.name?.[0]?.toUpperCase() || "U"}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="font-medium text-sm">{user.name}</span>
							<span className="text-xs text-muted-foreground">
								{user.email}
							</span>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "role",
			header: "Role",
			cell: ({ row }) => {
				const role = row.original.role;
				return (
					<Badge variant={role === "ADMIN" ? "destructive" : "secondary"}>
						{role}
					</Badge>
				);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const isBanned = row.original.isBanned;
				return (
					<Badge
						variant={isBanned ? "destructive" : "outline"}
						className={isBanned ? "" : "text-green-500 border-green-500"}>
						{isBanned ? "Banned" : "Active"}
					</Badge>
				);
			},
		},
		{
			accessorKey: "createdAt",
			header: "Joined Date",
			cell: ({ row }) => {
				return formatShortDate(row.original.createdAt);
			},
		},
		{
			id: "actions",
			header: "Actions",
			meta: {
				className: "w-23",
			},
			cell: ({ row }) => {
				const user = row.original;
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() => navigator.clipboard.writeText(user.id)}>
								Copy User ID
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem asChild>
								<Link href={`/admin/users/${user.id}`}>View Details</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								disabled={updateRoleMutation.isPending}
								onClick={() =>
									updateRoleMutation.mutate({
										user,
										newRole: user.role === "ADMIN" ? "USER" : "ADMIN",
									})
								}>
								{user.role === "ADMIN" ? (
									<>
										<Shield className="mr-2 h-4 w-4" /> Demote to User
									</>
								) : (
									<>
										<ShieldAlert className="mr-2 h-4 w-4" /> Promote to Admin
									</>
								)}
							</DropdownMenuItem>
							<DropdownMenuItem
								variant={user.isBanned ? "default" : "destructive"}
								onClick={async () => {
									if (user.isBanned) {
										toggleBanMutation.mutate(user);
									} else {
										const ok = await confirm(
											"Are you sure?",
											`This will ban ${user.name} and revoke all their active sessions immediately. They will not be able to log in until unbanned.`
										);
										if (ok) {
											toggleBanMutation.mutate(user);
										}
									}
								}}>
								{user.isBanned ? (
									<>
										<CheckCircle className="mr-2 h-4 w-4" /> Unban User
									</>
								) : (
									<>
										<Ban className="mr-2 h-4 w-4" /> Ban User
									</>
								)}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-3xl font-bold tracking-tight">User Management</h2>
			</div>

			<div className="flex items-center gap-4">
				<SearchInput placeholder="Search users..." />
				<Select
					value={params.role || "ALL"}
					onValueChange={(value) =>
						setParams((prev) => ({
							...prev,
							role: value === "ALL" ? "" : (value as Role),
							page: 1,
						}))
					}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Filter by Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="ALL">All Roles</SelectItem>
						<SelectItem value="ADMIN">Admin</SelectItem>
						<SelectItem value="USER">User</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<DataTable
				columns={columns}
				data={usersData?.data || []}
				isLoading={isLoading}
				loadingRows={params.limit}
			/>
			{usersData?.meta && (
				<Pagination
					meta={usersData.meta}
					limit={params.limit}
					onChange={(newParams) => {
						setParams((prev) => ({ ...prev, ...newParams }));
					}}
				/>
			)}
		</div>
	);
}
