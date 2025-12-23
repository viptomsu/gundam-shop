import { fetchApi } from "@/lib/api";
import { Brand } from "@prisma/client";
import { NavSectionGrid, NavSectionItem } from "./nav-section-grid";

type BrandWithCount = Brand & {
  _count: {
    products: number;
  };
};

type ApiResponse = {
  data: BrandWithCount[];
  meta: {
    total: number;
  };
};

export async function BrandNav() {
  let brands: BrandWithCount[] = [];

  try {
    const response = await fetchApi<ApiResponse>("/api/brands?limit=4", {
      next: { revalidate: 60 },
    });
    brands = response.data;
  } catch (error) {
    console.error("Failed to fetch brands:", error);
  }

  if (brands.length === 0) {
    return null;
  }

  const items: NavSectionItem[] = brands.map((brand) => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
    image: brand.logo,
    count: brand._count.products,
  }));

  return (
    <NavSectionGrid
      title="Shop by Brand"
      viewAllHref="/brands"
      baseHref="/brands"
      items={items}
      variant="brand"
      badgeLabel="PRODUCTS"
      actionLabel="VIEW ALL"
    />
  );
}
