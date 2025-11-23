import { serialize } from "cookie";
import { NextResponse } from "next/server";
import {
	ACCESS_TOKEN_EXPIRES_IN,
	REFRESH_TOKEN_EXPIRES_IN,
} from "@/config/auth";

export function getAuthCookies(req: Request) {
	const cookieHeader = req.headers.get("cookie");
	const cookies = Object.fromEntries(
		cookieHeader?.split("; ").map((c) => c.split("=")) || []
	);
	return {
		accessToken: cookies.accessToken,
		refreshToken: cookies.refreshToken,
	};
}

export function setAuthCookies(
	response: NextResponse,
	accessToken: string,
	refreshToken: string
) {
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

	response.headers.append("Set-Cookie", accessTokenCookie);
	response.headers.append("Set-Cookie", refreshTokenCookie);
}

export function clearAuthCookies(response: NextResponse) {
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

	response.headers.append("Set-Cookie", accessTokenCookie);
	response.headers.append("Set-Cookie", refreshTokenCookie);
}
