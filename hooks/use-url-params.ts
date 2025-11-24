"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import queryString from "query-string";
import { stringifyUrl } from "@/utils/query-params";

export function useUrlParams() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const setParam = useCallback(
		(key: string, value: string | number | null) => {
			const current = queryString.parse(searchParams.toString());
			const query = { ...current, [key]: value };

			const url = stringifyUrl(pathname, query);
			router.replace(url);
		},
		[pathname, router, searchParams]
	);

	const getParam = useCallback(
		(key: string) => {
			return searchParams.get(key);
		},
		[searchParams]
	);

	return { setParam, getParam, searchParams };
}
