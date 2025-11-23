import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookies, clearAuthCookies } from "@/lib/auth-cookies";

export async function POST(req: Request) {
	try {
		const { refreshToken } = getAuthCookies(req);

		if (refreshToken) {
			await prisma.refreshToken.deleteMany({
				where: { token: refreshToken },
			});
		}

		const response = NextResponse.json(
			{ message: "Logged out" },
			{ status: 200 }
		);

		clearAuthCookies(response);

		return response;
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}
