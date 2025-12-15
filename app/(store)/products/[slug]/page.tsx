import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductView } from "@/components/store/product-view";

import type { Product, ProductVariant, Brand, Series } from "@prisma/client";

type ProductWithRelations = Product & {
	variants: ProductVariant[];
	brand: Brand;
	series: Series | null;
};

interface ProductPageProps {
	params: Promise<{ slug: string }>;
}

async function getProduct(slug: string): Promise<ProductWithRelations | null> {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
	const res = await fetch(`${baseUrl}/api/products/slug/${slug}`, {
		next: { revalidate: 60 }, // Cache for 60 seconds
	});

	if (!res.ok) {
		if (res.status === 404) return null;
		throw new Error("Failed to fetch product");
	}

	return res.json();
}

export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { slug } = await params;
	const product = await getProduct(slug);

	if (!product) {
		return {
			title: "Product Not Found",
		};
	}

	return {
		title: `${product.name} | Gundam Shop`,
		description:
			product.description?.slice(0, 160) ||
			`Shop ${product.name} - ${product.grade || ""} ${product.scale || ""}`,
		openGraph: {
			title: product.name,
			description: product.description?.slice(0, 160),
			images: product.images[0] ? [product.images[0]] : undefined,
		},
	};
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { slug } = await params;
	const product = await getProduct(slug);

	if (!product) {
		notFound();
	}

	return (
		<main className="min-h-screen bg-background">
			<ProductView product={product} />
		</main>
	);
}
