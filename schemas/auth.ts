import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(3, "Password must be at least 3 characters"),
});

export const registerSchema = z
	.object({
		username: z.string().min(1, "Username is required"),
		password: z.string().min(3, "Password must be at least 3 characters"),
		confirmPassword: z.string().min(1, "Confirm password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface User {
	id: string;
	username: string;
	role: string;
}
