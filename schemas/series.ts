import { z } from "zod";

export const seriesSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().optional(),
	image: z.string().optional(),
});

export type SeriesFormValues = z.infer<typeof seriesSchema>;
