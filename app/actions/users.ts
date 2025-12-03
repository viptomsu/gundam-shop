"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function toggleUserBan(userId: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { isBanned: true },
		});

		if (!user) {
			throw new Error("User not found");
		}

		const newBanStatus = !user.isBanned;

		await prisma.$transaction(async (tx) => {
			await tx.user.update({
				where: { id: userId },
				data: { isBanned: newBanStatus },
			});

			if (newBanStatus) {
				// Revoke all refresh tokens if banning
				await tx.refreshToken.deleteMany({
					where: { userId },
				});
			}
		});

		revalidatePath("/admin/users");
		return { success: true, isBanned: newBanStatus };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

export async function updateUserRole(userId: string, newRole: Role) {
	try {
		await prisma.user.update({
			where: { id: userId },
			data: { role: newRole },
		});

		revalidatePath("/admin/users");
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

export async function getUserStats() {
	const [totalUsers, newUsers] = await Promise.all([
		prisma.user.count(),
		prisma.user.count({
			where: {
				createdAt: {
					gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
				},
			},
		}),
	]);

	return { totalUsers, newUsers };
}
