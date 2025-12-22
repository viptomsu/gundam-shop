"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormValues } from "@/schemas/user";
import { updateProfile } from "@/app/actions/account";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AvatarUploader } from "@/components/ui/avatar-uploader";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
	initialData: ProfileFormValues & { email: string };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
	const [isPending, startTransition] = useTransition();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: initialData.name,
			phone: initialData.phone || "",
			address: initialData.address || "",
			image: initialData.image || null,
		},
	});

	function onSubmit(values: ProfileFormValues) {
		startTransition(async () => {
			const result = await updateProfile(values);
			if (result.success) {
				toast.success("Profile updated successfully");
			} else {
				toast.error(result.message || "Something went wrong");
			}
		});
	}

	return (
		<div className="max-w-2xl mx-auto p-6 bg-card/50 backdrop-blur-sm border border-primary/10 clip-mecha">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{/* Avatar Section */}
					<div className="flex justify-center mb-8">
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<AvatarUploader
											value={field.value}
											onChange={field.onChange}
											disabled={isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Name */}
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">
										Pilot Name
									</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="Enter your name"
											className="clip-mecha"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{/* Email - Read Only */}
						<FormItem>
							<FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">
								Identification (Email)
							</FormLabel>
							<FormControl>
								<Input
									disabled
									value={initialData.email}
									className="bg-muted clip-mecha opacity-80"
								/>
							</FormControl>
						</FormItem>

						{/* Phone */}
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">
										Comms Link (Phone)
									</FormLabel>
									<FormControl>
										<Input
											disabled={isPending}
											placeholder="+84..."
											className="clip-mecha"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					{/* Address */}
					<FormField
						control={form.control}
						name="address"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="uppercase text-xs tracking-wider text-muted-foreground">
									Base Location (Address)
								</FormLabel>
								<FormControl>
									<Textarea
										disabled={isPending}
										placeholder="Enter your address"
										className="min-h-[100px] clip-mecha resize-none"
										{...field}
										value={field.value || ""}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Submit Button */}
					<div className="flex justify-end pt-4">
						<Button
							type="submit"
							disabled={isPending}
							className="clip-mecha min-w-[150px]">
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Updating...
								</>
							) : (
								<>
									<Save className="mr-2 h-4 w-4" />
									Update Profile
								</>
							)}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
