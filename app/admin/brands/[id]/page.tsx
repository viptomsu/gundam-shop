"use client";

import { BrandForm } from "@/components/admin/brand-form";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { use } from "react";

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

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 pt-6">
				<BrandForm initialData={brand} />
			</div>
		</div>
	);
}
