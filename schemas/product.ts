import { z } from "zod";

export const productSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	price: z.coerce.number().min(0, "Price must be non-negative"),
	stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
	images: z.array(z.url()),
});

export type ProductFormValues = z.infer<typeof productSchema>;
