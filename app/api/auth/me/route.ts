import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = Object.fromEntries(
      cookieHeader?.split("; ").map((c) => c.split("=")) || []
    );
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded: any;
    try {
      decoded = verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, username: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
