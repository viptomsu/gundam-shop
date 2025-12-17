import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { paginationSchema } from "@/schemas/common";
import { OrderStatus } from "@prisma/client";

const orderFilterSchema = z.object({
	status: z.nativeEnum(OrderStatus).optional(),
	search: z.string().optional(),
});

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);

		const { page, limit } = paginationSchema.parse({
			page: searchParams.get("page"),
			limit: searchParams.get("limit"),
		});

		const { status, search } = orderFilterSchema.parse({
			status: searchParams.get("status") || undefined,
			search: searchParams.get("search") || undefined,
		});

		const skip = (page - 1) * limit;

		const where: any = {};

		if (status) {
			where.status = status;
		}

		if (search) {
			where.orderNumber = { contains: search, mode: "insensitive" as const };
		}

		const [orders, total] = await Promise.all([
			prisma.order.findMany({
				where,
				skip,
				take: limit,
				orderBy: { createdAt: "desc" },
				include: {
					user: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
					orderItems: {
						include: {
							variant: {
								select: {
									id: true,
									name: true,
									image: true,
									product: {
										select: {
											id: true,
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
			}),
			prisma.order.count({ where }),
		]);

		const totalPages = Math.ceil(total / limit);

		return NextResponse.json({
			data: orders,
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
		console.error("Failed to fetch orders:", error);
		return NextResponse.json(
			{ error: "Failed to fetch orders" },
			{ status: 500 }
		);
	}
}
