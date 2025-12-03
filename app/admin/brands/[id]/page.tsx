"use client";

import { BrandForm } from "@/components/admin/brand-form";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { use } from "react";
import { NotFound } from "@/components/ui/not-found";

export default function EditBrandPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);

	const { data: brand, isLoading } = useQuery({
		queryKey: ["brand", id],
		queryFn: async () => {
			const res = await api.get(`/brands/${id}`);
			return res.data;
		},
	});

	if (isLoading) {
		return (
			<div className="flex h-full items-center justify-center">
				<Loader2 className="h-6 w-6 animate-spin" />
			</div>
		);
	}

	if (!brand) {
		return (
			<NotFound
				title="Brand not found"
				description="The brand you are looking for does not exist or has been deleted."
				linkText="Back to Brands"
				linkHref="/admin/brands"
			/>
		);
	}

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 pt-6">
				<BrandForm initialData={brand} />
			</div>
		</div>
	);
}
