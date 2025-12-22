"use server";

import { prisma } from "@/lib/prisma";
import { profileSchema, type ProfileFormValues } from "@/schemas/user";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import { revalidatePath } from "next/cache";

interface UpdateProfileResult {
	success: boolean;
	message?: string;
}

export async function updateProfile(
	formData: ProfileFormValues
): Promise<UpdateProfileResult> {
	try {
		const cookieStore = await cookies();
		const accessToken = cookieStore.get("accessToken")?.value;

		if (!accessToken) {
			return { success: false, message: "Unauthorized" };
		}

		let decoded: { userId: string };
		try {
			decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: string };
		} catch {
			return { success: false, message: "Invalid token" };
		}

		const validatedData = profileSchema.safeParse(formData);
		if (!validatedData.success) {
			return {
				success: false,
				message: validatedData.error.issues[0]?.message || "Invalid form data",
			};
		}

		await prisma.user.update({
			where: { id: decoded.userId },
			data: {
				name: validatedData.data.name,
				phone: validatedData.data.phone,
				address: validatedData.data.address,
				avatar: validatedData.data.image,
			},
		});

		revalidatePath("/account");
		revalidatePath("/account/profile");

		return { success: true, message: "Profile updated successfully" };
	} catch (error) {
		console.error("[UPDATE_PROFILE_ERROR]", error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : "Failed to update profile",
		};
	}
}
