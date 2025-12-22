import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { productSchema } from "@/schemas/product";
import { paginationSchema, searchSchema } from "@/schemas/common";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const search = searchParams.get("search") || "";

		const brandIds = searchParams.getAll("brandId");
		const categoryIds = searchParams.getAll("categoryId");
		const seriesIds = searchParams.getAll("seriesId");
		const grades = searchParams.getAll("grade");
		const scales = searchParams.getAll("scale");

		const isFeatured = searchParams.get("isFeatured");
		const isArchived = searchParams.get("isArchived");

		const { page, limit } = paginationSchema.parse({
			page: searchParams.get("page"),
			limit: searchParams.get("limit"),
		});

		const skip = (page - 1) * limit;

		const where: any = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: "insensitive" as const } },
				{ description: { contains: search, mode: "insensitive" as const } },
			];
		}

		if (brandIds.length > 0) where.brandId = { in: brandIds };
		if (seriesIds.length > 0) where.seriesId = { in: seriesIds };
		if (categoryIds.length > 0)
			where.categories = { some: { id: { in: categoryIds } } };
		if (grades.length > 0) where.grade = { in: grades };
		if (scales.length > 0) where.scale = { in: scales };

		if (isFeatured !== null) where.isFeatured = isFeatured === "true";
		if (isArchived !== null) where.isArchived = isArchived === "true";

		// Handle sort parameter
		const sort = searchParams.get("sort") || "newest";
		let orderBy: any = { createdAt: "desc" };

		switch (sort) {
			case "oldest":
				orderBy = { createdAt: "asc" };
				break;
			case "name-asc":
				orderBy = { name: "asc" };
				break;
			case "name-desc":
				orderBy = { name: "desc" };
				break;
			case "price-asc":
			case "price-desc":
				// Price sorting handled after enrichment
				orderBy = { createdAt: "desc" };
				break;
			default:
				orderBy = { createdAt: "desc" };
		}

		const [products, total] = await Promise.all([
			prisma.product.findMany({
				where,
				skip,
				take: limit,
				orderBy,
				include: { categories: true, brand: true, variants: true },
			}),
			prisma.product.count({ where }),
		]);

		const enrichedProducts = products.map((product) => {
			const variants = product.variants;
			const totalStock = variants.reduce((acc, v) => acc + v.stock, 0);
			const prices = variants.map((v) => Number(v.price));
			const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
			const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

			return {
				...product,
				totalStock,
				minPrice,
				maxPrice,
				variantCount: variants.length,
			};
		});

		// Handle price sorting after enrichment
		if (sort === "price-asc") {
			enrichedProducts.sort((a, b) => a.minPrice - b.minPrice);
		} else if (sort === "price-desc") {
			enrichedProducts.sort((a, b) => b.minPrice - a.minPrice);
		}

		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			data: enrichedProducts,
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
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: (error as any).errors },
				{ status: 400 }
			);
		}
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

		const { categoryIds, variants, ...rest } = validatedData;

		const product = await prisma.$transaction(async (tx) => {
			// 1. Create Product
			const newProduct = await tx.product.create({
				data: {
					...rest,
					categories: {
						connect: categoryIds?.map((id) => ({ id })),
					},
				},
			});

			// 2. Create Variants
			if (variants && variants.length > 0) {
				await tx.productVariant.createMany({
					data: variants.map((variant) => ({
						...variant,
						productId: newProduct.id,
					})),
				});
			}

			return newProduct;
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
