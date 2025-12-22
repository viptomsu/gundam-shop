import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { generateContent, generateImage } from "../utils/ai";
import { uploadToCloudinary } from "../utils/image";

const prisma = new PrismaClient();

// Helper to clean JSON
function cleanJson(text: string): string {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

// Interfaces for AI Response
interface AIProductVariant {
  name: string;
  sku: string;
  price: number;
  stock: number;
  description_for_image_prompt: string;
}

interface AIProduct {
  name: string;
  slug: string;
  description: string;
  grade: string;
  scale: string;
  brandSlug: string;
  seriesSlug: string;
  categorySlugs: string[];
  variants: AIProductVariant[];
}

async function main() {
  const BATCH_SIZE = 3; // Number of products to generate per AI call
  const requestedCount = parseInt(process.argv[2]) || 3;

  console.log(
    `🚀 Starting Product Seeding... Goal: ${requestedCount} products.`
  );

  try {
    // 1. Fetch Master Data
    const brands = await prisma.brand.findMany();
    const categories = await prisma.category.findMany();
    const series = await prisma.series.findMany();

    if (brands.length === 0 || categories.length === 0) {
      throw new Error(
        "❌ Missing Brands or Categories. Please run seed-master-data.ts first."
      );
    }

    // 2. Prepare Context for AI
    const brandList = brands
      .map((b) => `${b.name} (slug: ${b.slug})`)
      .join(", ");
    const categoryList = categories
      .map((c) => `${c.name} (slug: ${c.slug})`)
      .join(", ");
    const seriesList = series
      .map((s) => `${s.name} (slug: ${s.slug})`)
      .join(", ");

    console.log(
      `📊 Context: ${brands.length} Brands, ${categories.length} Categories, ${series.length} Series.`
    );

    let processedCount = 0;

    // 3. Generation Loop
    while (processedCount < requestedCount) {
      const remaining = requestedCount - processedCount;
      const countToGen = Math.min(remaining, BATCH_SIZE);

      console.log(`\n🤖 Generating Batch: ${countToGen} products...`);

      const prompt = `
        You are a Gundam E-Commerce Data Generator.
        Context:
        - Brands: [${brandList}]
        - Categories: [${categoryList}]
        - Series: [${seriesList}]

        Task: Generate ${countToGen} realistic Gundam Products.
        
        **Rules**:
        1. **Distribute evenly** among valid Brands, Categories, and Series provided above.
        2. **Variants**: Each product MUST have between 2 to 5 variants (e.g., "Ver. Ka", "Clear Color", "Mechanical Clear", "Titanium Finish").
        3. **Images**: DO NOT generate image URLs. Instead, provide a highly detailed "description_for_image_prompt" for each variant, describing the Gundam's pose, colors, and lighting for an anime-style product shot.
        4. **Slugs**: Must be unique and kebab-case. 
        5. **Must match** the provided slugs exactly for relations.

        **Output Format** (JSON Array):
        [
          {
            "name": "String",
            "slug": "String", // Unique
            "description": "String (Markdown supported)",
            "grade": "String (e.g. HG, MG, PG, RG)",
            "scale": "String (e.g. 1/144, 1/100)",
            "brandSlug": "String (Existing Slug)",
            "seriesSlug": "String (Existing Slug)",
            "categorySlugs": ["String", "String"], // List of Category Slugs
            "variants": [
              {
                "name": "String",
                "sku": "String",
                "price": Number,
                "stock": Number,
                "description_for_image_prompt": "String"
              }
            ]
          }
        ]
      `;

      // Call AI for Metadata
      const aiResponse = await generateContent({
        prompt,
        model: "pro",
        thinking: true,
      });

      const generatedProducts: AIProduct[] = JSON.parse(
        cleanJson(aiResponse || "[]")
      );

      if (!generatedProducts.length) {
        console.warn("⚠️ AI returned no products. Retrying...");
        continue;
      }

      console.log(
        `✅ AI returned metadata for ${generatedProducts.length} products. Processing images & DB...`
      );

      // Process each product
      for (const p of generatedProducts) {
        // Resolve IDs
        const brand = brands.find((b) => b.slug === p.brandSlug);
        const seriesItem = series.find((s) => s.slug === p.seriesSlug);
        const validCategories = categories.filter((c) =>
          p.categorySlugs.includes(c.slug)
        );

        if (!brand) {
          console.error(
            `   ❌ Brand not found: ${p.brandSlug}, skipping product ${p.name}`
          );
          continue;
        }

        // Generate Images and Upload for VARIANTS
        const variantDataWithImages = await Promise.all(
          p.variants.map(async (v) => {
            console.log(
              `      🎨 Generating image for variant: ${p.name} - ${v.name}...`
            );
            let imageUrl: string | null = null;
            try {
              const imageBuffer = await generateImage(
                v.description_for_image_prompt
              );
              if (imageBuffer) {
                // Upload to Cloudinary
                process.stdout.write("         ☁️ Uploading...");
                imageUrl = await uploadToCloudinary(imageBuffer, "products");
                console.log(" Done.");
              } else {
                console.warn("         ⚠️ Failed into generate image buffer.");
              }
            } catch (err) {
              console.error(`         ❌ Image Error:`, err);
            }
            return { ...v, imageUrl };
          })
        );

        // Collect all variant images for the Product Gallery
        const galleryImages = variantDataWithImages
          .map((v) => v.imageUrl)
          .filter((url): url is string => !!url); // Remove nulls

        // Write to DB
        try {
          await prisma.product.create({
            data: {
              name: p.name,
              slug: p.slug,
              description: p.description,
              grade: p.grade,
              scale: p.scale,
              brandId: brand.id,
              seriesId: seriesItem?.id,
              images: galleryImages, // Product-level gallery includes all variant images
              categories: {
                connect: validCategories.map((c) => ({ id: c.id })),
              },
              variants: {
                create: variantDataWithImages.map((v) => ({
                  name: v.name,
                  sku: v.sku,
                  price: v.price,
                  stock: v.stock,
                  image: v.imageUrl,
                  isArchived: false,
                })),
              },
            },
          });
          console.log(
            `   💾 Saved Product: ${p.name} (${variantDataWithImages.length} variants)`
          );
        } catch (dbError) {
          // Handle duplicate slug error gracefully
          console.error(`   ❌ DB Error saving ${p.name}:`, dbError);
        }
      }

      processedCount += generatedProducts.length;
    }

    console.log(`\n✨ Seeding Complete! Processed ${processedCount} products.`);
  } catch (error) {
    console.error("❌ Fatal Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
