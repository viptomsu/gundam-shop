import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookies } from "@/lib/auth-cookies";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import { userSchema } from "@/schemas/user";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { accessToken } = getAuthCookies(req);
		if (!accessToken) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		try {
			verify(accessToken, ACCESS_TOKEN_SECRET);
		} catch {
			return NextResponse.json({ message: "Invalid token" }, { status: 401 });
		}

		const { id } = await params;

		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				avatar: true,
				phone: true,
				address: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user) {
			return NextResponse.json({ message: "User not found" }, { status: 404 });
		}

		return NextResponse.json(user);
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { accessToken } = getAuthCookies(req);
		if (!accessToken) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		try {
			verify(accessToken, ACCESS_TOKEN_SECRET);
		} catch {
			return NextResponse.json({ message: "Invalid token" }, { status: 401 });
		}

		const { id } = await params;
		const body = await req.json();
		// Partial validation for update
		const updateSchema = userSchema.partial();
		const { name, email, password, role, phone, address, avatar } =
			updateSchema.parse(body);

		const data: any = {
			name,
			email,
			role,
			phone,
			address,
			avatar,
		};

		if (password) {
			data.password = await bcrypt.hash(password, 10);
		}

		const user = await prisma.user.update({
			where: { id },
			data,
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
				avatar: true,
				phone: true,
				address: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return NextResponse.json(user);
	} catch (error: any) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: (error as any).errors },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { accessToken } = getAuthCookies(req);
		if (!accessToken) {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		try {
			verify(accessToken, ACCESS_TOKEN_SECRET);
		} catch {
			return NextResponse.json({ message: "Invalid token" }, { status: 401 });
		}

		const { id } = await params;

		await prisma.user.delete({
			where: { id },
		});

		return NextResponse.json({ message: "User deleted" });
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}
