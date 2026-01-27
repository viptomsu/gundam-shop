import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GUNDAM_GRADES } from "@/config/constants";

export async function GET() {
	try {
		// Group products by grade and count them
		const gradeCounts = await prisma.product.groupBy({
			by: ["grade"],
			_count: {
				_all: true,
			},
			where: {
				isArchived: false,
				grade: {
					not: null,
				},
			},
		});

		// Map counts to the defined grades constant
		const gradesWithCount = GUNDAM_GRADES.map((gradeDef) => {
			const found = gradeCounts.find((g) => g.grade === gradeDef.value);
			return {
				...gradeDef,
				count: found ? found._count._all : 0,
			};
		});

		// Sort by count descending
		gradesWithCount.sort((a, b) => b.count - a.count);

		return NextResponse.json({
			data: gradesWithCount,
		});
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 },
		);
	}
}
