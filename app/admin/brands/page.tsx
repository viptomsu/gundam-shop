"use client";

import { GenericAdminPage } from "@/components/admin/generic-admin-page";

export default function BrandsPage() {
	return (
		<GenericAdminPage
			title="Brands"
			queryKey="brands"
			apiUrl="/brands"
			searchPlaceholder="Search brands..."
			newLink="/admin/brands/create"
			imageKey="logo"
			editPath="/admin/brands"
		/>
	);
}
