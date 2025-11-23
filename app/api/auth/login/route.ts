import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/schemas/auth";
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
    const body = await req.json();
    const { username, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const accessToken = sign(
      { userId: user.id, username: user.username, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = sign({ userId: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    // Store refresh token in DB
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 1000),
      },
    });

    const accessTokenCookie = serialize("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshTokenCookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: REFRESH_TOKEN_EXPIRES_IN,
    });

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: { id: user.id, username: user.username, role: user.role },
      },
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
