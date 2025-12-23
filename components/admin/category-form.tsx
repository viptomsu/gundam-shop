"use client";

import { CategoryFormValues } from "@/schemas/category";
import { GenericAdminForm } from "@/components/admin/generic-admin-form";

interface CategoryFormProps {
  initialData?: CategoryFormValues & { id: string };
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const initialValues = initialData
    ? {
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        image: initialData.image || "",
        order: initialData.order || 0,
      }
    : {
        name: "",
        slug: "",
        description: "",
        image: "",
        order: 0,
      };

  return (
    <GenericAdminForm
      initialValues={initialValues}
      apiEndpoint="/categories"
      redirectUrl="/admin/categories"
      title={initialData ? "Edit Category" : "Create Category"}
      queryKey="categories"
      id={initialData?.id}
      folder="gundam/categories"
    />
  );
}
