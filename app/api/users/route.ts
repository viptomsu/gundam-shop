import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookies } from "@/lib/auth-cookies";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import { paginationSchema } from "@/schemas/common";
import { userSchema } from "@/schemas/user";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const search = searchParams.get("search") || "";

		const { page, limit } = paginationSchema.parse({
			page: searchParams.get("page"),
			limit: searchParams.get("limit"),
		});

		const skip = (page - 1) * limit;

		const role = searchParams.get("role") as "ADMIN" | "USER" | null;

		const where: any = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
			];
		}

		if (role) {
			where.role = role;
		}

		const [users, total] = await Promise.all([
			prisma.user.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				select: {
					id: true,
					name: true,
					email: true,
					role: true,
					avatar: true,
					isBanned: true,
					phone: true,
					address: true,
					createdAt: true,
					updatedAt: true,
				},
			}),
			prisma.user.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			data: users,
			meta: {
				page,
				limit,
				total,
				totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		});
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

export async function POST(req: Request) {
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

		const body = await req.json();
		const { name, email, password, role, phone, address, avatar } =
			userSchema.parse(body);

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "User with this email already exists" },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(password || "123456", 10);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role,
				phone,
				address,
				avatar,
			},
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

		return NextResponse.json(user, { status: 201 });
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
