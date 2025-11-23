import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/auth";
import {
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	ACCESS_TOKEN_EXPIRES_IN,
	REFRESH_TOKEN_EXPIRES_IN,
} from "@/config/auth";
import { setAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { username, password } = loginSchema.parse(body);

		const user = await prisma.user.findUnique({
			where: { username },
		});

		if (!user) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const isValidPassword = await compare(password, user.password);

		if (!isValidPassword) {
			return NextResponse.json(
				{ message: "Invalid credentials" },
				{ status: 401 }
			);
		}

		const accessToken = sign(
			{ userId: user.id, username: user.username, role: user.role },
			ACCESS_TOKEN_SECRET,
			{ expiresIn: ACCESS_TOKEN_EXPIRES_IN }
		);

		const refreshToken = sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
			expiresIn: REFRESH_TOKEN_EXPIRES_IN,
		});

		// Store refresh token in DB
		await prisma.refreshToken.create({
			data: {
				token: refreshToken,
				userId: user.id,
				expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000),
			},
		});

		const response = NextResponse.json(
			{
				message: "Login successful",
				user: { id: user.id, username: user.username, role: user.role },
			},
			{ status: 200 }
		);

		setAuthCookies(response, accessToken, refreshToken);

		return response;
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}
