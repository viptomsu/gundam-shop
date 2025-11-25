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
import { SlugField } from "@/components/admin/slug-field";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { Editor } from "@/components/ui/editor";

const formSchema = z.object({
	name: z.string().min(1, "Name is required"),
	slug: z.string().min(1, "Slug is required"),
	description: z.string().optional(),
	image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface GenericAdminFormProps {
	initialValues: FormValues;
	apiEndpoint: string;
	redirectUrl: string;
	title: string;
	queryKey: string;
	id?: string; // ID for update
	// Config for fields
	imageLabel?: string;
	folder?: string;
	transformValues?: (values: FormValues) => any;
}

export function GenericAdminForm({
	initialValues,
	apiEndpoint,
	redirectUrl,
	title,
	queryKey,
	id,
	imageLabel = "Image",
	folder = "gundam",
	transformValues,
}: GenericAdminFormProps) {
	const router = useRouter();
	const [loading, setLoading] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: initialValues,
	});

	const onSubmit = async (data: FormValues) => {
		try {
			setLoading(true);
			const payload = transformValues ? transformValues(data) : data;

			if (id) {
				await api.put(`${apiEndpoint}/${id}`, payload);
			} else {
				await api.post(apiEndpoint, payload);
			}
			router.push(redirectUrl);
			router.refresh();
			toast.success(id ? "Updated successfully" : "Created successfully");
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
					<div className="grid gap-8 md:grid-cols-3">
						<div className="space-y-4 md:col-span-1">
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{imageLabel}</FormLabel>
										<FormControl>
											<ImageUpload
												value={field.value ? [field.value] : []}
												disabled={loading}
												onChange={(url) => field.onChange(url[url.length - 1])}
												onRemove={() => field.onChange("")}
												folder={folder}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input disabled={loading} placeholder="Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<SlugField
								control={form.control}
								name="slug"
								sourceValue={form.watch("name")}
								setValue={form.setValue}
								disabled={loading}
								placeholder="slug"
								isEditing={!!id}
								label="Slug"
							/>
						</div>
						<div className="space-y-4 md:col-span-2">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="h-full">
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Editor
												value={field.value || ""}
												onChange={field.onChange}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{id ? "Save changes" : "Create"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
