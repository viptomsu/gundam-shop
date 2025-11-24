import queryString from "query-string";

export const stringifyUrl = (url: string, query: Record<string, any>) => {
	return queryString.stringifyUrl(
		{ url, query },
		{ skipNull: true, skipEmptyString: true }
	);
};

export const parseUrl = (url: string) => {
	return queryString.parseUrl(url);
};

export const stringifyQuery = (query: Record<string, any>) => {
	return queryString.stringify(query, {
		skipNull: true,
		skipEmptyString: true,
	});
};
export const parseQuery = (query: string) => {
	return queryString.parse(query, {
		parseNumbers: true,
		parseBooleans: true,
	});
};
