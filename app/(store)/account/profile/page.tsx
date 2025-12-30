import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";
import { getServerAuthCookies } from "@/lib/auth-cookies";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
	const { accessToken } = await getServerAuthCookies();

	if (!accessToken) {
		redirect("/login");
	}

	let decoded: { userId: string };
	try {
		decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: string };
	} catch {
		redirect("/login");
	}

	const user = await prisma.user.findUnique({
		where: { id: decoded.userId },
		select: {
			name: true,
			email: true,
			phone: true,
			address: true,
			avatar: true,
		},
	});

	if (!user) {
		redirect("/login");
	}

	const initialData = {
		name: user.name || "",
		email: user.email,
		phone: user.phone,
		address: user.address,
		image: user.avatar,
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-2xl font-bold tracking-tight uppercase text-primary">
					Pilot Profile
				</h3>
				<p className="text-sm text-muted-foreground">
					Manage your personal identification and communication settings.
				</p>
			</div>
			<div className="border-t border-primary/20" />
			<ProfileForm initialData={initialData} />
		</div>
	);
}
