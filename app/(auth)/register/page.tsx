"use client";

import { RegisterForm } from "./register-form";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoadingScreen } from "@/components/ui/loading-screen";

export default function RegisterPage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && user) {
			router.push("/");
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return <LoadingScreen />;
	}

	if (user) {
		return null;
	}

	return <RegisterForm />;
}
