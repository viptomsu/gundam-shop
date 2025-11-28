import { NextResponse } from "next/server";
import { verify, sign } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import {
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRES_IN,
	REFRESH_TOKEN_EXPIRES_IN,
} from "@/config/auth";
import { getAuthCookies, setAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: Request) {
	try {
		const { refreshToken } = getAuthCookies(req);

		if (!refreshToken) {
			return NextResponse.json(
				{ message: "No refresh token" },
				{ status: 401 }
			);
		}

		// Verify token
		let decoded: any;
		try {
			decoded = verify(refreshToken, REFRESH_TOKEN_SECRET);
		} catch (error) {
			return NextResponse.json(
				{ message: "Invalid refresh token" },
				{ status: 401 }
			);
		}

		// Check DB
		const savedToken = await prisma.refreshToken.findUnique({
			where: { token: refreshToken },
			include: { user: true },
		});

		if (!savedToken || savedToken.revoked) {
			// Token reuse detection could go here (revoke all user tokens)
			return NextResponse.json(
				{ message: "Invalid refresh token" },
				{ status: 401 }
			);
		}

		// Rotate Refresh Token
		const newRefreshToken = sign(
			{ userId: savedToken.userId },
			REFRESH_TOKEN_SECRET,
			{ expiresIn: REFRESH_TOKEN_EXPIRES_IN }
		);

		// Update DB: Revoke old, create new (or just update)
		// Better to revoke old and create new to track history, but for simplicity we can update or replace.
		// Let's delete old and create new to keep table clean, or just update.
		// Requirement: "auto refresh token".

		// Transaction to ensure atomicity
		await prisma.$transaction([
			prisma.refreshToken.delete({ where: { token: refreshToken } }),
			prisma.refreshToken.create({
				data: {
					token: newRefreshToken,
					userId: savedToken.userId,
					expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000),
				},
			}),
		]);

		const newAccessToken = sign(
			{
				userId: savedToken.user.id,
				username: savedToken.user.email,
				role: savedToken.user.role,
			},
			ACCESS_TOKEN_SECRET,
			{ expiresIn: ACCESS_TOKEN_EXPIRES_IN }
		);

		const response = NextResponse.json(
			{ message: "Token refreshed" },
			{ status: 200 }
		);

		setAuthCookies(response, newAccessToken, newRefreshToken);

		return response;
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}
