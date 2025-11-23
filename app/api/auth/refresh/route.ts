import { NextResponse } from "next/server";
import { verify, sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { prisma } from "@/lib/prisma";
import { parseDuration } from "@/lib/time";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
const ACCESS_TOKEN_EXPIRES_IN = parseDuration(
  process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
);
const REFRESH_TOKEN_EXPIRES_IN = parseDuration(
  process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"
);

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = Object.fromEntries(
      cookieHeader?.split("; ").map((c) => c.split("=")) || []
    );
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "No refresh token" },
        { status: 401 }
      );
    }

    // Verify token
    let decoded: any;
    try {
      decoded = verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Check DB
    const savedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!savedToken || savedToken.revoked) {
      // Token reuse detection could go here (revoke all user tokens)
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Rotate Refresh Token
    const newRefreshToken = sign(
      { userId: savedToken.userId },
      REFRESH_TOKEN_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );

    // Update DB: Revoke old, create new (or just update)
    // Better to revoke old and create new to track history, but for simplicity we can update or replace.
    // Let's delete old and create new to keep table clean, or just update.
    // Requirement: "auto refresh token".

    // Transaction to ensure atomicity
    await prisma.$transaction([
      prisma.refreshToken.delete({ where: { token: refreshToken } }),
      prisma.refreshToken.create({
        data: {
          token: newRefreshToken,
          userId: savedToken.userId,
          expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000),
        },
      }),
    ]);

    const newAccessToken = sign(
      {
        userId: savedToken.user.id,
        username: savedToken.user.username,
        role: savedToken.user.role,
      },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const accessTokenCookie = serialize("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshTokenCookie = serialize("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: REFRESH_TOKEN_EXPIRES_IN,
    });

    const response = NextResponse.json(
      { message: "Token refreshed" },
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
