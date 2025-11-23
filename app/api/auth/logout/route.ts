import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = Object.fromEntries(
      cookieHeader?.split("; ").map((c) => c.split("=")) || []
    );
    const refreshToken = cookies.refreshToken;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    const accessTokenCookie = serialize("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const refreshTokenCookie = serialize("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    const response = NextResponse.json(
      { message: "Logged out" },
      { status: 200 }
    );

    response.headers.append("Set-Cookie", accessTokenCookie);
    response.headers.append("Set-Cookie", refreshTokenCookie);

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
