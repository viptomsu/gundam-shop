"use client";

import { SeriesForm } from "@/components/admin/series-form";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { use } from "react";
import { NotFound } from "@/components/ui/not-found";

export default function EditSeriesPage({
	params,
}: {
	params: Promise<{ seriesId: string }>;
}) {
	const { seriesId } = use(params);

	const { data: series, isLoading } = useQuery({
		queryKey: ["series", seriesId],
		queryFn: async () => {
			const res = await api.get(`/series/${seriesId}`);
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

	if (!series) {
		return (
			<NotFound
				title="Series not found"
				description="The series you are looking for does not exist or has been deleted."
				linkText="Back to Series"
				linkHref="/admin/series"
			/>
		);
	}

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 pt-6">
				<SeriesForm initialData={series} />
			</div>
		</div>
	);
}
