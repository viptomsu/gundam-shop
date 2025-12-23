"use client";

import { SeriesFormValues } from "@/schemas/series";
import { GenericAdminForm } from "@/components/admin/generic-admin-form";

interface SeriesFormProps {
  initialData?: SeriesFormValues & { id: string };
}

export function SeriesForm({ initialData }: SeriesFormProps) {
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
      apiEndpoint="/series"
      redirectUrl="/admin/series"
      title={initialData ? "Edit Series" : "Create Series"}
      queryKey="series-list"
      id={initialData?.id}
      folder="gundam/series"
    />
  );
}
