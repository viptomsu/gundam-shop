"use client";

import { GenericAdminPage } from "@/components/admin/generic-admin-page";

export default function SeriesPage() {
	return (
		<GenericAdminPage
			title="Series"
			queryKey="series-list"
			apiUrl="/series"
			searchPlaceholder="Search series..."
			newLink="/admin/series/new"
			editPath="/admin/series"
		/>
	);
}
