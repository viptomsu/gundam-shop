import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { LoginInput, RegisterInput } from "@/schemas/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface User {
	id: string;
	username: string;
	role: "USER" | "ADMIN";
}

export function useAuth() {
	const {
		data: user,
		isLoading,
		error,
	} = useQuery<User | null>({
		queryKey: ["user"],
		queryFn: async () => {
			try {
				const res = await api.get("/auth/me");
				return res.data.user;
			} catch (err) {
				return null;
			}
		},
		retry: false,
	});

	return { user, isLoading, error };
}

export function useLogin() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async (data: LoginInput) => {
			const res = await api.post("/auth/login", data);
			return res.data;
		},
		onSuccess: (data) => {
			queryClient.setQueryData(["user"], data.user);
			toast.success("Logged in successfully");
			router.push("/");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Login failed");
		},
	});
}

export function useRegister() {
	const router = useRouter();

	return useMutation({
		mutationFn: async (data: RegisterInput) => {
			const res = await api.post("/auth/register", data);
			return res.data;
		},
		onSuccess: () => {
			toast.success("Registered successfully. Please login.");
			router.push("/login");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Registration failed");
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: async () => {
			await api.post("/auth/logout");
		},
		onSuccess: () => {
			queryClient.setQueryData(["user"], null);
			toast.success("Logged out");
			router.push("/login");
		},
	});
}
