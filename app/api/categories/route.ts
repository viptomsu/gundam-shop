import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookies } from "@/lib/auth-cookies";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import { paginationSchema } from "@/schemas/common";
import { categorySchema } from "@/schemas/category";
import { z } from "zod";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const search = searchParams.get("search") || "";

		const { page, limit } = paginationSchema.parse({
			page: searchParams.get("page"),
			limit: searchParams.get("limit"),
		});

		const skip = (page - 1) * limit;

		const where = search
			? {
					OR: [
						{ name: { contains: search, mode: "insensitive" as const } },
						{ description: { contains: search, mode: "insensitive" as const } },
					],
				}
			: {};

		const [categories, total] = await Promise.all([
			prisma.category.findMany({
				where,
				skip,
				take: limit,
				orderBy:
					searchParams.get("sort") === "popular"
						? { products: { _count: "desc" } }
						: [{ order: "asc" }, { createdAt: "desc" }],
				include: {
					_count: {
						select: { products: true },
					},
				},
			}),
			prisma.category.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			data: categories,
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
				{ status: 400 },
			);
		}
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 },
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
		const { name, slug, description, image, order } =
			categorySchema.parse(body);

		const category = await prisma.category.create({
			data: {
				name,
				slug,
				description,
				image,
			},
		});

		return NextResponse.json(category, { status: 201 });
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 },
		);
	}
}
