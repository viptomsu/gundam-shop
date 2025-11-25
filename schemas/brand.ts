import { z } from "zod";

export const brandSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().optional(),
	logo: z.string().optional(),
});

export type BrandFormValues = z.infer<typeof brandSchema>;
