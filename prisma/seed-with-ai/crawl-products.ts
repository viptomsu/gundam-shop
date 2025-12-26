import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { generateContent, generateImage } from "../../utils/ai";
import { uploadToCloudinary } from "../../utils/image";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

// ============================================
// TYPES
// ============================================

interface CrawledVariant {
	name: string;
	sku: string;
	price: number;
	stock: number;
	imagePrompt: string; // Description for AI image generation
}

interface CrawledProduct {
	name: string;
	slug: string;
	description: string;
	grade: string | null;
	scale: string | null;
	brandName: string;
	seriesName: string | null;
	categoryNames: string[];
	variants: CrawledVariant[];
	imagePrompt: string; // Main product image prompt
}

// ============================================
// HELPERS
// ============================================

function cleanJson(text: string): string {
	return text
		.replace(/```json/g, "")
		.replace(/```/g, "")
		.trim();
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim();
}

async function generateAndUploadImage(prompt: string): Promise<string | null> {
	try {
		console.log(`      🎨 Generating image...`);
		const buffer = await generateImage(prompt);

		if (!buffer) {
			console.warn(`      ⚠️ Failed to generate image`);
			return null;
		}

		process.stdout.write(`      ☁️ Uploading...`);
		const cloudinaryUrl = await uploadToCloudinary(buffer, "products");
		console.log(` Done.`);
		return cloudinaryUrl;
	} catch (error) {
		console.error(`      ❌ Error generating/uploading image:`, error);
		return null;
	}
}

// ============================================
// MASTER DATA RESOLVERS (Option B: Create if not exists)
// ============================================

async function resolveOrCreateBrand(name: string): Promise<string> {
	const slug = slugify(name);
	let brand = await prisma.brand.findUnique({ where: { slug } });

	if (!brand) {
		console.log(`   📦 Creating new Brand: ${name}`);
		brand = await prisma.brand.create({
			data: {
				name,
				slug,
				description: `${name} - Model kit and hobby products manufacturer.`,
			},
		});
	}

	return brand.id;
}

async function resolveOrCreateSeries(
	name: string | null
): Promise<string | null> {
	if (!name) return null;

	const slug = slugify(name);
	let series = await prisma.series.findUnique({ where: { slug } });

	if (!series) {
		console.log(`   📺 Creating new Series: ${name}`);
		series = await prisma.series.create({
			data: {
				name,
				slug,
				description: `${name} - Gundam series.`,
			},
		});
	}

	return series.id;
}

async function resolveOrCreateCategories(names: string[]): Promise<string[]> {
	const categoryIds: string[] = [];

	for (const name of names) {
		const slug = slugify(name);
		let category = await prisma.category.findUnique({ where: { slug } });

		if (!category) {
			console.log(`   🏷️ Creating new Category: ${name}`);
			category = await prisma.category.create({
				data: {
					name,
					slug,
					description: `${name} products for model building.`,
				},
			});
		}

		categoryIds.push(category.id);
	}

	return categoryIds;
}

// ============================================
// PRODUCT DATA GENERATION WITH AI
// ============================================

async function generateProductData(
	productNames: string[],
	existingBrands: string[],
	existingSeries: string[],
	existingCategories: string[]
): Promise<CrawledProduct[]> {
	const prompt = `
You are a Gundam E-Commerce Product Data Generator.

**CONTEXT**:
- Known Brands: [${existingBrands.join(", ")}]
- Known Series: [${existingSeries.join(", ")}]
- Known Categories: [${existingCategories.join(", ")}]

**TASK**: Generate detailed product data for these products:
${productNames.map((p, i) => `${i + 1}. ${p}`).join("\n")}

**RULES**:
1. Each product MUST have 1-3 variants (e.g., "Standard", "Ver.Ka", "Clear Color", "Titanium Finish")
2. For Gundam model kits, include grade (HG, MG, RG, PG, MGSD, FM) and scale (1/144, 1/100, 1/60)
3. For tools/supplies, grade and scale can be null
4. Prices should be in USD (US Dollars):
   - HG 1/144: 15 - 35 USD
   - RG 1/144: 30 - 50 USD
   - MG 1/100: 45 - 100 USD
   - PG 1/60: 180 - 400 USD
   - Tools: 5 - 80 USD
   - Paints/Supplies: 3 - 25 USD
5. Stock: random between 5-50
6. SKU format: BRAND-GRADE-SERIES-NUMBER (e.g., BND-HG-SEED-001)
7. Use existing brands/series/categories when they match, create new names if needed
8. For imagePrompt: Write a detailed description for AI image generation of the product, describing pose, colors, lighting, style

**OUTPUT FORMAT** (JSON Array):
[
  {
    "name": "HG 1/144 Mighty Strike Freedom Gundam",
    "slug": "hg-mighty-strike-freedom-gundam",
    "description": "Detailed markdown description with features, accessories, etc.",
    "grade": "HG",
    "scale": "1/144",
    "brandName": "Bandai",
    "seriesName": "Mobile Suit Gundam SEED / SEED Freedom",
    "categoryNames": ["Plastic Model Kits"],
    "imagePrompt": "A detailed product shot of the HG Mighty Strike Freedom Gundam kit box, showing the assembled model in heroic pose with golden wings spread, studio lighting, white background, anime style",
    "variants": [
      {
        "name": "Standard",
        "sku": "BND-HG-SEED-MSF-001",
        "price": 650000,
        "stock": 25,
        "imagePrompt": "HG Mighty Strike Freedom Gundam, standard colors, dynamic flying pose, detailed mechanical parts, studio product photography, white background"
      }
    ]
  }
]

IMPORTANT: Return ONLY valid JSON array, no other text.
`;

	console.log("🤖 Generating product data with AI...");

	const response = await generateContent({
		prompt,
		model: "pro",
		thinking: true,
	});

	const products: CrawledProduct[] = JSON.parse(cleanJson(response || "[]"));
	console.log(`✅ AI generated data for ${products.length} products`);

	return products;
}

// ============================================
// ADDITIONAL PRODUCTS GENERATION
// ============================================

async function generateAdditionalProductNames(
	count: number
): Promise<string[]> {
	const prompt = `
You are a Gundam hobby expert. Generate ${count} REAL Gundam product names that actually exist.

Include a mix of:
- Bandai HG kits (1/144 scale)
- Bandai MG kits (1/100 scale)
- Bandai RG kits (1/144 scale, higher detail)
- Bandai PG kits (1/60 scale, premium)
- Third-party kits (Motor Nuclear, Daban, etc.)
- Modeling tools (GodHand, Dspiae nippers, files)
- Paints and supplies (Tamiya, Mr. Hobby)

Focus on popular and recent releases (2020-2024).

**OUTPUT FORMAT** (JSON Array of strings):
["Product Name 1", "Product Name 2", ...]

IMPORTANT: Return ONLY valid JSON array, no other text.
`;

	console.log(`🎯 Generating ${count} additional product names...`);

	const response = await generateContent({
		prompt,
		model: "flash",
	});

	const names: string[] = JSON.parse(cleanJson(response || "[]"));
	console.log(`✅ Generated ${names.length} additional product names`);

	return names;
}

// ============================================
// SEED PRODUCT TO DATABASE
// ============================================

async function seedProduct(product: CrawledProduct): Promise<boolean> {
	try {
		console.log(`\n💾 Processing: ${product.name}`);

		// Check if product already exists
		const existing = await prisma.product.findUnique({
			where: { slug: product.slug },
		});

		if (existing) {
			console.log(`   ⚠️ Product already exists: ${product.slug}, skipping...`);
			return false;
		}

		// Resolve relations
		const brandId = await resolveOrCreateBrand(product.brandName);
		const seriesId = await resolveOrCreateSeries(product.seriesName);
		const categoryIds = await resolveOrCreateCategories(product.categoryNames);

		// Generate main product image
		console.log(`   🖼️ Generating product image...`);
		const productImage = await generateAndUploadImage(product.imagePrompt);
		const galleryImages: string[] = productImage ? [productImage] : [];

		// Generate variant images
		const variantsWithImages = await Promise.all(
			product.variants.map(async (v) => {
				console.log(`   🎨 Processing variant: ${v.name}`);
				let image: string | null = null;

				// Generate image for variant
				image = await generateAndUploadImage(v.imagePrompt);

				// Fallback to product image if variant image fails
				if (!image && productImage) {
					image = productImage;
				}

				// Add to gallery if unique
				if (image && !galleryImages.includes(image)) {
					galleryImages.push(image);
				}

				return {
					...v,
					image,
				};
			})
		);

		// Create product with variants
		await prisma.product.create({
			data: {
				name: product.name,
				slug: product.slug,
				description: product.description,
				grade: product.grade,
				scale: product.scale,
				images: galleryImages,
				brandId,
				seriesId,
				categories: {
					connect: categoryIds.map((id) => ({ id })),
				},
				variants: {
					create: variantsWithImages.map((v) => ({
						name: v.name,
						sku: v.sku,
						price: v.price,
						stock: v.stock,
						image: v.image,
						isArchived: false,
					})),
				},
			},
		});

		console.log(
			`   ✅ Saved: ${product.name} (${variantsWithImages.length} variants, ${galleryImages.length} images)`
		);
		return true;
	} catch (error) {
		console.error(`   ❌ Error saving ${product.name}:`, error);
		return false;
	}
}

// ============================================
// PARSE PRODUCTS.MD
// ============================================

function parseProductsMd(): string[] {
	const filePath = path.join(process.cwd(), "prisma/seed-data/products.md");
	const content = fs.readFileSync(filePath, "utf-8");

	// Extract product names from markdown (lines starting with **)
	const regex = /\*\*\d+\.\s+(.+?)\*\*/g;
	const matches = [...content.matchAll(regex)];

	return matches.map((m) => m[1].trim());
}

// ============================================
// MAIN
// ============================================

// Export for orchestration
export async function crawlProducts() {
	const BATCH_SIZE = 5; // Products per AI call
	const ADDITIONAL_PRODUCTS = parseInt(process.argv[2]) || 30;

	console.log("🚀 Starting Product Crawl Script...\n");

	try {
		// 1. Fetch existing master data for context
		const brands = await prisma.brand.findMany();
		const series = await prisma.series.findMany();
		const categories = await prisma.category.findMany();

		console.log(
			`📊 Existing Data: ${brands.length} Brands, ${series.length} Series, ${categories.length} Categories\n`
		);

		// 2. Parse products from products.md
		const baseProducts = parseProductsMd();
		console.log(`📄 Found ${baseProducts.length} products in products.md`);

		// 3. Generate additional product names
		const additionalProducts = await generateAdditionalProductNames(
			ADDITIONAL_PRODUCTS
		);

		// 4. Combine all product names
		const allProductNames = [...baseProducts, ...additionalProducts];
		console.log(`\n📦 Total products to process: ${allProductNames.length}\n`);

		// 5. Process in batches
		let successCount = 0;
		let failCount = 0;

		for (let i = 0; i < allProductNames.length; i += BATCH_SIZE) {
			const batch = allProductNames.slice(i, i + BATCH_SIZE);
			console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
			console.log(
				`📦 Batch ${Math.floor(i / BATCH_SIZE) + 1}: Processing ${
					batch.length
				} products`
			);
			console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

			// Generate detailed product data for this batch
			const products = await generateProductData(
				batch,
				brands.map((b) => b.name),
				series.map((s) => s.name),
				categories.map((c) => c.name)
			);

			// Seed each product
			for (const product of products) {
				const success = await seedProduct(product);
				if (success) {
					successCount++;
				} else {
					failCount++;
				}
			}

			// Rate limiting - wait between batches
			if (i + BATCH_SIZE < allProductNames.length) {
				console.log("\n⏳ Waiting 2s before next batch...");
				await new Promise((r) => setTimeout(r, 2000));
			}
		}

		// 6. Summary
		console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
		console.log(`✨ CRAWL COMPLETE!`);
		console.log(`   ✅ Success: ${successCount} products`);
		console.log(`   ❌ Failed/Skipped: ${failCount} products`);
		console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
	} catch (error) {
		console.error("❌ Fatal Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// Execute if run directly
if (require.main === module) {
	crawlProducts();
}
