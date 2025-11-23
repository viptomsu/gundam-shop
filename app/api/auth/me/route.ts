import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import { getAuthCookies } from "@/lib/auth-cookies";

export async function GET(req: Request) {
	try {
		const { accessToken } = getAuthCookies(req);

		if (!accessToken) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		let decoded: any;
		try {
			decoded = verify(accessToken, ACCESS_TOKEN_SECRET);
		} catch (error) {
			return NextResponse.json({ message: "Invalid token" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: decoded.userId },
			select: { id: true, username: true, role: true },
		});

		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json({ user }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}
