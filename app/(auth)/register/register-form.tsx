"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/schemas/auth";
import { useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function RegisterForm() {
	const { mutate: register, isPending } = useRegister();

	const form = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	function onSubmit(values: RegisterInput) {
		register(values);
	}

	return (
		<Card className="w-full relative border border-primary/20 bg-black/90 backdrop-blur-md p-6 shadow-lg sm:rounded-none">
			{/* Corner Accents */}
			<div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50" />
			<div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50" />
			<div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50" />
			<div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50" />

			<CardHeader className="space-y-1 mb-6">
				<CardTitle className="text-2xl font-bold tracking-tight text-center uppercase font-display text-white">
					New Pilot Registry
				</CardTitle>
				<CardDescription className="text-center text-muted-foreground">
					Create your pilot profile to begin.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-muted-foreground">
										Codename
									</FormLabel>
									<FormControl>
										<Input
											placeholder="RX-78"
											className="bg-background/20 border-primary/20 focus-visible:ring-primary/50 text-white placeholder:text-muted-foreground/50"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-muted-foreground">
										Email Identity
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="pilot@g-reticle.com"
											className="bg-background/20 border-primary/20 focus-visible:ring-primary/50 text-white placeholder:text-muted-foreground/50"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-muted-foreground">
										Access Code
									</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="••••••••"
											className="bg-background/20 border-primary/20 focus-visible:ring-primary/50 text-white placeholder:text-muted-foreground/50"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-muted-foreground">
										Confirm Access Code
									</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="••••••••"
											className="bg-background/20 border-primary/20 focus-visible:ring-primary/50 text-white placeholder:text-muted-foreground/50"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							className="w-full relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground"
							disabled={isPending}>
							{isPending ? "REGISTERING..." : "INITIALIZE REGISTRATION"}
						</Button>
					</form>
				</Form>
				<div className="mt-6 text-center text-sm">
					<span className="text-muted-foreground">
						Already have clearance?{" "}
					</span>
					<Link
						href="/login"
						className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors uppercase tracking-wide">
						Pilot Login
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
