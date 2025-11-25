"use client";

import { SeriesForm } from "@/components/admin/series-form";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { use } from "react";

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

	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 pt-6">
				<SeriesForm initialData={series} />
			</div>
		</div>
	);
}
