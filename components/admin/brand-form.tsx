"use client";

import { Brand } from "@prisma/client";
import { GenericAdminForm } from "@/components/admin/generic-admin-form";

interface BrandFormProps {
  initialData?: Brand | null;
}

export const BrandForm: React.FC<BrandFormProps> = ({ initialData }) => {
  const initialValues = initialData
    ? {
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description || "",
        image: initialData.logo || "",
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
      apiEndpoint="/brands"
      redirectUrl="/admin/brands"
      title={initialData ? "Edit Brand" : "Create Brand"}
      queryKey="brands"
      id={initialData?.id}
      imageLabel="Logo"
      folder="gundam/brands"
      transformValues={(values) => ({
        ...values,
        logo: values.image,
        image: undefined,
      })}
    />
  );
};
