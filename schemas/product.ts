import { z } from "zod";

export const productSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().min(1, "Description is required"),
	images: z.array(z.url()),
	brandId: z.string().min(1, "Brand is required"),
	seriesId: z.string().optional(),
	categoryIds: z.array(z.string()).optional(),
	grade: z.string().optional(),
	scale: z.string().optional(),
	isFeatured: z.boolean().default(false).optional(),
	isArchived: z.boolean().default(false).optional(),
	variants: z
		.array(
			z.object({
				name: z.string().min(1, "Variant name is required"),
				sku: z.string().min(1, "SKU is required"),
				price: z.coerce.number().min(0, "Price must be non-negative"),
				stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
				image: z.url().optional(),
				isArchived: z.boolean().default(false).optional(),
			})
		)
		.min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
