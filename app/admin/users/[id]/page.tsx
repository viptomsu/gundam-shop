"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import Link from "next/link";
import { formatShortDate } from "@/utils/format";
import { Role } from "@prisma/client";

export default function UserDetailPage() {
	const params = useParams();
	const id = params.id as string;

	const { data: user, isLoading } = useQuery({
		queryKey: ["user", id],
		queryFn: async () => {
			const res = await api.get(`/users/${id}`);
			return res.data;
		},
	});

	if (isLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4">
					<Skeleton className="h-10 w-10 rounded-md" />
					<Skeleton className="h-8 w-48" />
				</div>
				<Card>
					<CardHeader className="flex flex-row items-center gap-4 space-y-0">
						<Skeleton className="h-20 w-20 rounded-full" />
						<div className="space-y-2">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-48" />
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</CardContent>
				</Card>
			</div>
		);
	}

	if (!user) {
		return <div>User not found</div>;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<Button variant="outline" size="icon" asChild>
					<Link href="/admin/users">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<h1 className="text-2xl font-bold tracking-tight">User Details</h1>
			</div>

			<div className="grid gap-6 md:grid-cols-2">
				<Card className="md:col-span-2">
					<CardHeader className="flex flex-row items-center gap-6 space-y-0 pb-6">
						<Avatar className="h-24 w-24 border-2 border-border">
							<AvatarImage src={user.avatar || ""} alt={user.name || ""} />
							<AvatarFallback className="text-2xl">
								{user.name?.[0]?.toUpperCase() || "U"}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<div className="flex items-center gap-3">
								<h2 className="text-2xl font-bold">{user.name}</h2>
								<Badge
									variant={user.role === "ADMIN" ? "destructive" : "secondary"}>
									{user.role}
								</Badge>
								{user.isBanned && <Badge variant="destructive">Banned</Badge>}
							</div>
							<p className="text-muted-foreground flex items-center gap-2">
								<Mail className="h-4 w-4" />
								{user.email}
							</p>
							<p className="text-xs text-muted-foreground flex items-center gap-2">
								<span className="font-mono text-xs opacity-50">
									ID: {user.id}
								</span>
							</p>
						</div>
					</CardHeader>
					<Separator />
					<CardContent className="grid gap-6 pt-6 md:grid-cols-2">
						<div className="space-y-4">
							<h3 className="font-semibold flex items-center gap-2">
								<Shield className="h-4 w-4" /> Account Information
							</h3>
							<div className="grid gap-2 text-sm">
								<div className="grid grid-cols-3 gap-1">
									<span className="text-muted-foreground">Role:</span>
									<span className="col-span-2 font-medium">{user.role}</span>
								</div>
								<div className="grid grid-cols-3 gap-1">
									<span className="text-muted-foreground">Status:</span>
									<span className="col-span-2 font-medium">
										{user.isBanned ? (
											<span className="text-destructive">Banned</span>
										) : (
											<span className="text-green-500">Active</span>
										)}
									</span>
								</div>
								<div className="grid grid-cols-3 gap-1">
									<span className="text-muted-foreground">Joined:</span>
									<span className="col-span-2 font-medium">
										{formatShortDate(user.createdAt)}
									</span>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="font-semibold flex items-center gap-2">
								<MapPin className="h-4 w-4" /> Contact Details
							</h3>
							<div className="grid gap-2 text-sm">
								<div className="grid grid-cols-3 gap-1">
									<span className="text-muted-foreground flex items-center gap-2">
										<Phone className="h-3 w-3" /> Phone:
									</span>
									<span className="col-span-2 font-medium">
										{user.phone || "N/A"}
									</span>
								</div>
								<div className="grid grid-cols-3 gap-1">
									<span className="text-muted-foreground flex items-center gap-2">
										<MapPin className="h-3 w-3" /> Address:
									</span>
									<span className="col-span-2 font-medium">
										{user.address || "N/A"}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
