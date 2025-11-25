"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import api from "@/lib/axios";
import { Brand } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { Editor } from "@/components/ui/editor";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional(),
	image: z.string().optional(),
});

type BrandFormValues = z.infer<typeof formSchema>;

interface BrandFormProps {
	initialData?: Brand | null;
}

export const BrandForm: React.FC<BrandFormProps> = ({ initialData }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const title = initialData ? "Edit Brand" : "Create Brand";
	const action = initialData ? "Save changes" : "Create";
	const toastMessage = initialData ? "Brand updated." : "Brand created.";

	const form = useForm<BrandFormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData
			? {
					name: initialData.name,
					description: initialData.description || "",
					image: initialData.image || "",
			  }
			: {
					name: "",
					description: "",
					image: "",
			  },
	});

	const onSubmit = async (data: BrandFormValues) => {
		try {
			setLoading(true);
			if (initialData) {
				await api.put(`/brands/${initialData.id}`, data);
			} else {
				await api.post(`/brands`, data);
			}
			router.push(`/admin/brands`);
			router.refresh();
			toast.success(toastMessage);
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">{title}</h1>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="image"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Image</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value ? [field.value] : []}
										disabled={loading}
										onChange={(url) => field.onChange(url[url.length - 1])}
										onRemove={() => field.onChange("")}
										folder="gundam/brands"
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
											disabled={loading}
											placeholder="Brand name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Editor value={field.value || ""} onChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={loading} className="ml-auto" type="submit">
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{action}
					</Button>
				</form>
			</Form>
		</div>
	);
};
