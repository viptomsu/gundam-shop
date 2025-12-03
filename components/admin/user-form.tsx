"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ImageUpload } from "@/components/ui/image-upload";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userSchema, UserFormValues } from "@/schemas/user";
import api from "@/lib/axios";
import { getErrorMessage } from "@/utils/error";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Role } from "@prisma/client";

interface UserFormProps {
	initialData?: UserFormValues & { id: string };
}

export function UserForm({ initialData }: UserFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();

	const title = initialData ? "Edit User" : "Create User";
	const description = initialData ? "Edit a user" : "Add a new user";
	const action = initialData ? "Save changes" : "Create";

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: initialData || {
			name: "",
			email: "",
			password: "",
			role: Role.USER,
			phone: "",
			address: "",
			avatar: "",
		},
	});

	const mutation = useMutation({
		mutationFn: async (data: UserFormValues) => {
			if (initialData) {
				await api.put(`/users/${initialData.id}`, data);
			} else {
				await api.post("/users", data);
			}
		},
		onSuccess: () => {
			router.refresh();
			router.push("/admin/users");
			toast.success(initialData ? "User updated" : "User created");
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error) => {
			toast.error(getErrorMessage(error));
		},
	});

	const onSubmit = (data: UserFormValues) => {
		mutation.mutate(data);
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-3xl font-bold tracking-tight">{title}</h2>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full">
					<FormField
						control={form.control}
						name="avatar"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Avatar</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={mutation.isPending}
										onChange={(url) => field.onChange(url)}
										onRemove={() => field.onChange("")}
										folder="gundam/users"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid gap-8 md:grid-cols-2">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={mutation.isPending}
											placeholder="User name"
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
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											disabled={mutation.isPending}
											placeholder="Email address"
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
									<FormLabel>
										Password {initialData && "(Leave blank to keep current)"}
									</FormLabel>
									<FormControl>
										<Input
											type="password"
											disabled={mutation.isPending}
											placeholder="Password"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select
										disabled={mutation.isPending}
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue defaultValue={field.value} />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.values(Role).map((role) => (
												<SelectItem key={role} value={role}>
													{role}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											disabled={mutation.isPending}
											placeholder="Phone number"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input
											disabled={mutation.isPending}
											placeholder="Address"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<Button
						disabled={mutation.isPending}
						className="ml-auto"
						type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</div>
	);
}
