import { parseDuration } from "@/lib/time";

export const ACCESS_TOKEN_SECRET =
	process.env.ACCESS_TOKEN_SECRET || "access-secret";
export const REFRESH_TOKEN_SECRET =
	process.env.REFRESH_TOKEN_SECRET || "refresh-secret";

export const ACCESS_TOKEN_EXPIRES_IN = parseDuration(
	process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
);

export const REFRESH_TOKEN_EXPIRES_IN = parseDuration(
	process.env.REFRESH_TOKEN_EXPIRES_IN || "7d"
);
