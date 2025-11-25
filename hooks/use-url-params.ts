"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { parseQuery, stringifyUrl } from "@/utils/query-params";

export function useUrlParams<
	T = Record<string, string | number | boolean | string[]>
>(defaultValues?: Partial<T>) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const params = useMemo(() => {
		const parsed = parseQuery(searchParams.toString());
		return { ...defaultValues, ...parsed } as T;
	}, [searchParams, defaultValues]);

	const setParams = useCallback(
		(newParams: Partial<T> | ((prev: T) => Partial<T>)) => {
			const current = parseQuery(searchParams.toString()) as T;

			const updates =
				typeof newParams === "function" ? newParams(current) : newParams;

			const query = { ...current, ...updates };

			const url = stringifyUrl(pathname, query);
			router.replace(url);
		},
		[pathname, router, searchParams]
	);

	return [params, setParams] as const;
}
