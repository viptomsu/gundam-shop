import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthCookies } from "@/lib/auth-cookies";
import { verify } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import { seriesSchema } from "@/schemas/series";
import { z } from "zod";

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ seriesId: string }> }
) {
	try {
		const { seriesId } = await params;

		if (!seriesId) {
			return NextResponse.json(
				{ message: "Series ID is required" },
				{ status: 400 }
			);
		}

		const series = await prisma.series.findUnique({
			where: {
				id: seriesId,
			},
		});

		if (!series) {
			return NextResponse.json(
				{ message: "Series not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(series);
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ seriesId: string }> }
) {
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

		const { seriesId } = await params;
		const body = await req.json();
		const { name, slug, description, image } = seriesSchema.parse(body);

		if (!seriesId) {
			return NextResponse.json(
				{ message: "Series ID is required" },
				{ status: 400 }
			);
		}

		const series = await prisma.series.update({
			where: {
				id: seriesId,
			},
			data: {
				name,
				slug,
				description,
				image,
			},
		});

		return NextResponse.json(series);
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

export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ seriesId: string }> }
) {
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

		const { seriesId } = await params;

		if (!seriesId) {
			return NextResponse.json(
				{ message: "Series ID is required" },
				{ status: 400 }
			);
		}

		const series = await prisma.series.delete({
			where: {
				id: seriesId,
			},
		});

		return NextResponse.json(series);
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}
