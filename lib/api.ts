export const BASE_URL =
	process.env.APP_URL ||
	process.env.NEXT_PUBLIC_APP_URL ||
	"http://localhost:3000";

export async function fetchApi<T>(
	endpoint: string,
	options?: RequestInit
): Promise<T> {
	const url = endpoint.startsWith("http")
		? endpoint
		: `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

	const res = await fetch(url, options);

	if (!res.ok) {
		throw new Error(`API call failed: ${res.statusText}`);
	}

	return res.json();
}
