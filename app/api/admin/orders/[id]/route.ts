import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/proxy";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	// Verify admin access
	const authResult = await verifyAdmin(request);
	if (!authResult.success) {
		return authResult.response;
	}

	try {
		const { id } = await params;

		const order = await prisma.order.findUnique({
			where: { id },
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
		});

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		return NextResponse.json({ data: order });
	} catch (error) {
		console.error("Failed to fetch order:", error);
		return NextResponse.json(
			{ error: "Failed to fetch order" },
			{ status: 500 }
		);
	}
}
