import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const newArrivals = await prisma.product.findMany({
			take: 4,
			orderBy: {
				createdAt: "desc",
			},
			where: {
				isArchived: false,
			},
			include: {
				variants: {
					take: 1,
					orderBy: {
						price: "asc",
					},
				},
			},
		});

		return NextResponse.json(newArrivals);
	} catch (error) {
		console.error("[NEW_ARRIVALS_GET]", error);
		return new NextResponse("Internal error", { status: 500 });
	}
}
