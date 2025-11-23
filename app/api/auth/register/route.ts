import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/schemas/auth";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { username, password } = registerSchema.parse(body);

		const existingUser = await prisma.user.findUnique({
			where: { username },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "Username already exists" },
				{ status: 409 }
			);
		}

		const hashedPassword = await hash(password, 10);

		const user = await prisma.user.create({
			data: {
				username,
				password: hashedPassword,
			},
		});

		return NextResponse.json(
			{
				message: "User created successfully",
				user: { id: user.id, username: user.username },
			},
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: error.message || "Something went wrong" },
			{ status: 500 }
		);
	}
}
