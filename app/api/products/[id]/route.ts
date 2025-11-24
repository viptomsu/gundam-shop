import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { productSchema } from "@/schemas/product";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const product = await prisma.product.findUnique({
			where: { id },
		});

		if (!product) {
			return NextResponse.json({ error: "Product not found" }, { status: 404 });
		}

		return NextResponse.json(product);
	} catch (error) {
		console.error("Failed to fetch product:", error);
		return NextResponse.json(
			{ error: "Failed to fetch product" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		const body = await request.json();
		const validatedData = productSchema.parse(body);

		const product = await prisma.product.update({
			where: { id },
			data: validatedData,
		});

		return NextResponse.json(product);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: (error as any).errors },
				{ status: 400 }
			);
		}
		console.error("Failed to update product:", error);
		return NextResponse.json(
			{ error: "Failed to update product" },
			{ status: 500 }
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params;
		await prisma.product.delete({
			where: { id },
		});

		return NextResponse.json({ message: "Product deleted" });
	} catch (error) {
		console.error("Failed to delete product:", error);
		return NextResponse.json(
			{ error: "Failed to delete product" },
			{ status: 500 }
		);
	}
}
