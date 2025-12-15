import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	try {
		const { slug } = await params;
		const product = await prisma.product.findUnique({
			where: { slug },
			include: {
				variants: {
					where: { isArchived: false },
					orderBy: { createdAt: "asc" },
				},
				brand: true,
				series: true,
			},
		});

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json(product);
	} catch (error) {
		console.error("Failed to fetch product by slug:", error);
		return NextResponse.json(
			{ error: "Failed to fetch product" },
			{ status: 500 }
		);
	}
}
