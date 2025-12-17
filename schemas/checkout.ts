import { z } from "zod";

export const checkoutFormSchema = z.object({
	guestName: z
		.string()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name is too long"),
	guestEmail: z.string().email("Please enter a valid email address"),
	guestPhone: z
		.string()
		.min(10, "Phone number must be at least 10 characters")
		.max(15, "Phone number is too long"),
	shippingAddress: z
		.string()
		.min(10, "Address must be at least 10 characters")
		.max(500, "Address is too long"),
	note: z.string().max(500, "Note is too long").optional(),
	paymentMethod: z.enum(["COD", "BANK_TRANSFER"], {
		error: "Please select a payment method",
	}),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;
