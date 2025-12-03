import { z } from "zod";
import { Role } from "@prisma/client";

export const userSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters")
		.optional(),
	role: z.nativeEnum(Role).default(Role.USER),
	phone: z.string().optional().nullable(),
	address: z.string().optional().nullable(),
	avatar: z.string().optional().nullable(),
});

export type UserFormValues = z.infer<typeof userSchema>;
