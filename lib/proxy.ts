import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ACCESS_TOKEN_SECRET } from "@/config/auth";
import type { Role, User } from "@prisma/client";

type SafeUser = Omit<User, "password">;

interface AuthResult {
	user: SafeUser;
}

/**
 * Server-side authentication guard.
 * Verifies the access token and returns the authenticated user.
 * Redirects to login if not authenticated.
 */
export async function requireAuth(): Promise<AuthResult> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		redirect("/login?redirect=/account");
	}

	let decoded: { userId: string };
	try {
		decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: string };
	} catch {
		redirect("/login?redirect=/account");
	}

	const user = await prisma.user.findUnique({
		where: { id: decoded.userId },
	});

	if (!user) {
		redirect("/login?redirect=/account");
	}

	// Remove password from user object
	const { password: _, ...safeUser } = user;

	return { user: safeUser };
}

/**
 * Server-side admin guard.
 * Verifies the access token and checks for ADMIN role.
 * Redirects to login if not authenticated or not an admin.
 */
export async function requireAdmin(): Promise<AuthResult> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		redirect("/login?redirect=/admin");
	}

	let decoded: { userId: string };
	try {
		decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: string };
	} catch {
		redirect("/login?redirect=/admin");
	}

	const user = await prisma.user.findUnique({
		where: { id: decoded.userId },
	});

	if (!user) {
		redirect("/login?redirect=/admin");
	}

	if (user.role !== "ADMIN") {
		// Non-admin users get redirected to home
		redirect("/");
	}

	// Check if user is banned
	if (user.isBanned) {
		redirect("/login?error=banned");
	}

	// Remove password from user object
	const { password: _, ...safeUser } = user;

	return { user: safeUser };
}

/**
 * Server-side role guard.
 * Verifies the access token and checks for specific roles.
 * Redirects to login if not authenticated or doesn't have required role.
 */
export async function requireRole(
	allowedRoles: Role[],
	redirectTo: string = "/"
): Promise<AuthResult> {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get("accessToken")?.value;

	if (!accessToken) {
		redirect("/login?redirect=" + encodeURIComponent(redirectTo));
	}

	let decoded: { userId: string };
	try {
		decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: string };
	} catch {
		redirect("/login?redirect=" + encodeURIComponent(redirectTo));
	}

	const user = await prisma.user.findUnique({
		where: { id: decoded.userId },
	});

	if (!user) {
		redirect("/login?redirect=" + encodeURIComponent(redirectTo));
	}

	if (!allowedRoles.includes(user.role)) {
		redirect("/");
	}

	if (user.isBanned) {
		redirect("/login?error=banned");
	}

	// Remove password from user object
	const { password: _, ...safeUser } = user;

	return { user: safeUser };
}

// ============================================
// API Route Helpers (return JSON responses)
// ============================================

interface ApiAuthResult {
	success: true;
	user: SafeUser;
}

interface ApiAuthError {
	success: false;
	response: NextResponse;
}

type ApiAuthResponse = ApiAuthResult | ApiAuthError;

/**
 * Verify authentication for API routes.
 * Returns user if authenticated, or error response if not.
 */
export async function verifyAuth(request: Request): Promise<ApiAuthResponse> {
	const cookieHeader = request.headers.get("cookie");
	const cookies = Object.fromEntries(
		cookieHeader?.split("; ").map((c) => c.split("=")) || []
	);
	const accessToken = cookies.accessToken;

	if (!accessToken) {
		return {
			success: false,
			response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}

	let decoded: { userId: string };
	try {
		decoded = verify(accessToken, ACCESS_TOKEN_SECRET) as { userId: string };
	} catch {
		return {
			success: false,
			response: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
		};
	}

	const user = await prisma.user.findUnique({
		where: { id: decoded.userId },
	});

	if (!user) {
		return {
			success: false,
			response: NextResponse.json({ error: "User not found" }, { status: 401 }),
		};
	}

	if (user.isBanned) {
		return {
			success: false,
			response: NextResponse.json({ error: "User is banned" }, { status: 403 }),
		};
	}

	const { password: _, ...safeUser } = user;
	return { success: true, user: safeUser };
}

/**
 * Verify admin access for API routes.
 * Returns user if authenticated and is admin, or error response if not.
 */
export async function verifyAdmin(request: Request): Promise<ApiAuthResponse> {
	const authResult = await verifyAuth(request);

	if (!authResult.success) {
		return authResult;
	}

	if (authResult.user.role !== "ADMIN") {
		return {
			success: false,
			response: NextResponse.json(
				{ error: "Forbidden: Admin access required" },
				{ status: 403 }
			),
		};
	}

	return authResult;
}
