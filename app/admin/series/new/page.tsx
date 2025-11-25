import { SeriesForm } from "@/components/admin/series-form";

export default function CreateSeriesPage() {
	return (
		<div className="flex-col">
			<div className="flex-1 space-y-4 pt-6">
				<SeriesForm />
			</div>
		</div>
	);
}
