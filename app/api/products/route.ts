import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { productSchema } from "@/schemas/product";
import { paginationSchema, searchSchema } from "@/schemas/common";

const prisma = new PrismaClient();

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
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

		const [products, total] = await Promise.all([
			prisma.product.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
			}),
			prisma.product.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			data: products,
			meta: {
				page,
				limit,
				total,
				totalPages,
				hasNextPage: page < totalPages,
				hasPreviousPage: page > 1,
			},
		});
	} catch (error) {
		console.error("Failed to fetch products:", error);
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const validatedData = productSchema.parse(body);

		const product = await prisma.product.create({
			data: validatedData,
		});

		return NextResponse.json(product, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: (error as any).errors },
				{ status: 400 }
			);
		}
		console.error("Failed to create product:", error);
		return NextResponse.json(
			{ error: "Failed to create product" },
			{ status: 500 }
		);
	}
}
