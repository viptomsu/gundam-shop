"use client";

import { GenericAdminPage } from "@/components/admin/generic-admin-page";

export default function CategoriesPage() {
	return (
		<GenericAdminPage
			title="Categories"
			queryKey="categories"
			apiUrl="/categories"
			searchPlaceholder="Search categories..."
			newLink="/admin/categories/create"
			editPath="/admin/categories"
		/>
	);
}
