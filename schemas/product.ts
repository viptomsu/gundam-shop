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
			z
				.object({
					name: z.string().min(1, "Variant name is required"),
					sku: z.string().min(1, "SKU is required"),
					price: z.coerce.number().min(0, "Price must be non-negative"),
					stock: z.coerce.number().int().min(0, "Stock must be non-negative"),
					image: z.url().optional(),
					isArchived: z.boolean().default(false).optional(),
					salePrice: z.coerce
						.number()
						.min(0, "Sale price must be non-negative")
						.optional(),
					saleStartDate: z.coerce.date().optional(),
					saleEndDate: z.coerce.date().optional(),
				})
				.superRefine((data, ctx) => {
					if (data.salePrice && data.salePrice >= data.price) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Sale price must be less than regular price",
							path: ["salePrice"],
						});
					}

					if (data.saleStartDate && !data.saleEndDate) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "End date is required when start date is set",
							path: ["saleEndDate"],
						});
					}

					if (!data.saleStartDate && data.saleEndDate) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "Start date is required when end date is set",
							path: ["saleStartDate"],
						});
					}

					if (
						data.saleStartDate &&
						data.saleEndDate &&
						data.saleStartDate > data.saleEndDate
					) {
						ctx.addIssue({
							code: z.ZodIssueCode.custom,
							message: "End date must be after start date",
							path: ["saleEndDate"],
						});
					}
				})
		)
		.min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
