import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { generateImage } from "../../utils/ai";
import { uploadToCloudinary } from "../../utils/image";

const prisma = new PrismaClient();

// ============================================
// Cloudinary folders matching admin form usage
// ============================================
const FOLDERS = {
	brands: "brands",
	series: "series",
	categories: "categories",
} as const;

// ============================================
// Image prompt generators
// ============================================

function getBrandImagePrompt(
	brandName: string,
	description: string | null
): string {
	const basePrompt = `Professional brand logo for "${brandName}"`;

	const brandPrompts: Record<string, string> = {
		bandai:
			"Bandai Namco official logo, red and white colors, clean vector style, professional corporate branding, transparent background, high quality",
		"motor nuclear":
			"Motor Nuclear mecha model brand logo, Chinese third-party model manufacturer, metallic silver and blue colors, aggressive mechanical design, futuristic font",
		godhand:
			"GodHand Japanese tool brand logo, precision tool manufacturer, elegant gold and black design, premium quality craftsmanship aesthetic",
		"mr. hobby":
			"Mr. Hobby GSI Creos paint brand logo, hobby paint and supplies manufacturer, professional modeling supplies branding, clean design",
		dspiae:
			"Dspiae model tool brand logo, modern Chinese tool manufacturer, sleek professional design, precision engineering aesthetic",
		tamiya:
			"Tamiya official brand logo, classic Japanese model kit manufacturer, iconic red and blue star design, professional modeling brand",
	};

	const lowercaseName = brandName.toLowerCase();
	for (const [key, prompt] of Object.entries(brandPrompts)) {
		if (lowercaseName.includes(key)) {
			return prompt;
		}
	}

	return `${basePrompt}, professional product photography style, hobby brand identity, clean modern design`;
}

function getSeriesImagePrompt(
	seriesName: string,
	description: string | null
): string {
	const seriesPrompts: Record<string, string> = {
		"universal century":
			"Mobile Suit Gundam RX-78-2, original white and blue Gundam, epic mecha pose, dramatic lighting, anime style, Universal Century era",
		seed: "Gundam SEED Freedom Strike Freedom Gundam, golden wings spread, dramatic pose, SEED FREEDOM movie style, vibrant colors",
		"witch from mercury":
			"Gundam Aerial from Witch from Mercury, white and orange color scheme, school setting aesthetic, modern anime style",
		"iron-blooded":
			"Gundam Barbatos from Iron-Blooded Orphans, aggressive combat pose, raw mechanical design, gritty aesthetic, no beam weapons",
		"00": "Gundam Exia from Gundam 00, GN Drive glowing, sleek modern design, particle effects, green energy glow",
		build:
			"Gunpla Battle scene, colorful custom Gundams fighting, Build Fighters style, bright anime colors, creative custom builds",
		requiem:
			"Gundam from Requiem for Vengeance, realistic military design, gritty European war setting, Unreal Engine style, dark atmosphere",
		"g gundam":
			"God Gundam Mobile Fighter G Gundam, fighting pose, martial arts mecha, red gold colors, dramatic action pose",
		wing: "Wing Gundam from Gundam Wing, angel wings spread, beam rifle ready, elegant design, 90s anime style",
	};

	const lowercaseName = seriesName.toLowerCase();
	for (const [key, prompt] of Object.entries(seriesPrompts)) {
		if (lowercaseName.includes(key)) {
			return prompt;
		}
	}

	return `Gundam mecha from ${seriesName} anime series, dynamic pose, professional anime artwork style, detailed mechanical design`;
}

function getCategoryImagePrompt(
	categoryName: string,
	description: string | null
): string {
	const categoryPrompts: Record<string, string> = {
		"plastic model":
			"Gunpla plastic model kit box art style, assembled Gundam model on display stand, hobby workbench background, professional product photography",
		cutting:
			"Professional model nippers and cutting tools, GodHand style single-blade nipper, precision cutting tools for plastic models, clean product photography",
		painting:
			"Model painting supplies, Gundam Markers and panel line accent colors, airbrush and paint bottles, hobby painting setup",
		detail:
			"Gunpla detail-up parts and accessories, waterslide decals, metal parts, LED units, hobby accessories display",
	};

	const lowercaseName = categoryName.toLowerCase();
	for (const [key, prompt] of Object.entries(categoryPrompts)) {
		if (lowercaseName.includes(key)) {
			return prompt;
		}
	}

	return `Gunpla hobby ${categoryName} products, professional product photography, hobby supplies aesthetic`;
}

// ============================================
// Main crawl function
// ============================================

async function generateAndUploadImage(
	prompt: string,
	folder: string
): Promise<string | null> {
	try {
		console.log(`   🎨 Generating image...`);
		const buffer = await generateImage(prompt);

		if (!buffer) {
			console.warn(`   ⚠️ Failed to generate image`);
			return null;
		}

		process.stdout.write(`   ☁️ Uploading to ${folder}...`);
		const cloudinaryUrl = await uploadToCloudinary(buffer, folder);
		console.log(` Done.`);
		return cloudinaryUrl;
	} catch (error) {
		console.error(`   ❌ Error:`, error);
		return null;
	}
}

async function crawlBrandImages() {
	console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log("📦 Processing Brands");
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

	const brands = await prisma.brand.findMany({
		where: { logo: null },
	});

	console.log(`Found ${brands.length} brands without images\n`);

	for (const brand of brands) {
		console.log(`🏷️ ${brand.name}`);
		const prompt = getBrandImagePrompt(brand.name, brand.description);
		const imageUrl = await generateAndUploadImage(prompt, FOLDERS.brands);

		if (imageUrl) {
			await prisma.brand.update({
				where: { id: brand.id },
				data: { logo: imageUrl },
			});
			console.log(`   ✅ Updated logo for ${brand.name}\n`);
		}
	}
}

async function crawlSeriesImages() {
	console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log("📺 Processing Series");
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

	const series = await prisma.series.findMany({
		where: { image: null },
	});

	console.log(`Found ${series.length} series without images\n`);

	for (const s of series) {
		console.log(`🎬 ${s.name}`);
		const prompt = getSeriesImagePrompt(s.name, s.description);
		const imageUrl = await generateAndUploadImage(prompt, FOLDERS.series);

		if (imageUrl) {
			await prisma.series.update({
				where: { id: s.id },
				data: { image: imageUrl },
			});
			console.log(`   ✅ Updated image for ${s.name}\n`);
		}
	}
}

async function crawlCategoryImages() {
	console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
	console.log("🏷️ Processing Categories");
	console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

	const categories = await prisma.category.findMany({
		where: { image: null },
	});

	console.log(`Found ${categories.length} categories without images\n`);

	for (const category of categories) {
		console.log(`📁 ${category.name}`);
		const prompt = getCategoryImagePrompt(category.name, category.description);
		const imageUrl = await generateAndUploadImage(prompt, FOLDERS.categories);

		if (imageUrl) {
			await prisma.category.update({
				where: { id: category.id },
				data: { image: imageUrl },
			});
			console.log(`   ✅ Updated image for ${category.name}\n`);
		}
	}
}

// ============================================
// Main
// ============================================

// Export for orchestration
export async function crawlMasterImages(target: string = "all") {
	console.log("🚀 Starting Master Data Image Crawl...\n");

	try {
		if (!target || target === "all") {
			await crawlBrandImages();
			await crawlSeriesImages();
			await crawlCategoryImages();
		} else if (target === "brands") {
			await crawlBrandImages();
		} else if (target === "series") {
			await crawlSeriesImages();
		} else if (target === "categories") {
			await crawlCategoryImages();
		} else {
			console.log(
				"Usage: npx ts-node scripts/crawl-master-images.ts [brands|series|categories|all]"
			);
		}

		console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
		console.log("✨ Image crawl complete!");
		console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
	} catch (error) {
		console.error("❌ Fatal Error:", error);
	} finally {
		await prisma.$disconnect();
	}
}

// Execute if run directly
if (require.main === module) {
	const target = process.argv[2]; // brands, series, categories, or all
	crawlMasterImages(target);
}
