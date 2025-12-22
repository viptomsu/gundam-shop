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

		let decoded: { userId: string };
		try {
			decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: string };
		} catch {
			return NextResponse.json({ message: "Invalid token" }, { status: 401 });
		}

		const orders = await prisma.order.findMany({
			where: { userId: decoded.userId },
			orderBy: { createdAt: "desc" },
			include: {
				orderItems: {
					include: {
						variant: {
							select: {
								id: true,
								name: true,
								image: true,
								product: {
									select: {
										name: true,
										slug: true,
										images: true,
									},
								},
							},
						},
					},
				},
			},
		});

		return NextResponse.json({ orders }, { status: 200 });
	} catch (error: unknown) {
		console.error("[GET_MY_ORDERS_ERROR]", error);
		return NextResponse.json(
			{
				message:
					error instanceof Error ? error.message : "Something went wrong",
			},
			{ status: 500 }
		);
	}
}
