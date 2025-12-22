"use client";

import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

export default function ProfilePage() {
	const { user, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className="space-y-4 animate-pulse">
				<div className="h-8 w-48 bg-card/50" />
				<div className="h-64 bg-card/50" />
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-bold flex items-center gap-2">
					<User className="h-6 w-6 text-primary" />
					Profile
				</h1>
				<p className="text-sm text-muted-foreground mt-1 font-mono">
					Your personal information
				</p>
			</div>

			{/* Profile Info */}
			<div className="border border-border/50 bg-card/30 overflow-hidden">
				{/* Profile Header */}
				<div className="p-6 border-b border-border/30 bg-secondary/20">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-primary/20 border border-primary/30 flex items-center justify-center clip-mecha">
							<User className="h-8 w-8 text-primary" />
						</div>
						<div>
							<h2 className="text-xl font-bold">
								{user.name ?? "Unnamed Pilot"}
							</h2>
							<p className="text-sm text-muted-foreground font-mono">
								{user.role === "ADMIN" ? ">> ADMINISTRATOR" : ">> PILOT"}
							</p>
						</div>
					</div>
				</div>

				{/* Profile Details */}
				<div className="p-6 space-y-4">
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="p-4 border border-border/30 bg-card/20">
							<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
								<Mail className="h-3 w-3" />
								EMAIL
							</div>
							<p className="font-medium">{user.email}</p>
						</div>

						<div className="p-4 border border-border/30 bg-card/20">
							<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
								<Phone className="h-3 w-3" />
								PHONE
							</div>
							<p className="font-medium">
								{user.phone ?? (
									<span className="text-muted-foreground italic">Not set</span>
								)}
							</p>
						</div>

						<div className="p-4 border border-border/30 bg-card/20 sm:col-span-2">
							<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
								<MapPin className="h-3 w-3" />
								ADDRESS
							</div>
							<p className="font-medium">
								{user.address ?? (
									<span className="text-muted-foreground italic">Not set</span>
								)}
							</p>
						</div>

						<div className="p-4 border border-border/30 bg-card/20">
							<div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
								<Calendar className="h-3 w-3" />
								MEMBER SINCE
							</div>
							<p className="font-medium font-mono">
								{format(new Date(user.createdAt), "PPP")}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Info Note */}
			<div className="p-4 border border-border/30 bg-card/20 text-sm text-muted-foreground">
				<p className="font-mono text-xs mb-1">[ SYSTEM NOTE ]</p>
				<p>
					Profile editing is coming soon. For now, please contact support to
					update your information.
				</p>
			</div>
		</div>
	);
}
