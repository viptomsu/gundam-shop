import { z } from "zod";

export const paginationSchema = z.object({
	page: z.preprocess(
		(val) => (val === "" || val === null ? undefined : val),
		z.coerce.number().int().min(1).default(1)
	),
	limit: z.preprocess(
		(val) => (val === "" || val === null ? undefined : val),
		z.coerce.number().int().min(1).max(100).default(10)
	),
});

export const searchSchema = z.object({
	search: z.string().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
export type SearchParams = z.infer<typeof searchSchema>;
