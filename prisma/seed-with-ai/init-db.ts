import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { seedMasterData } from "./seed-master-data";
import { crawlProducts } from "./crawl-products";
import { crawlMasterImages } from "./crawl-master-images";

const prisma = new PrismaClient();

async function initDb() {
	console.log("==========================================");
	console.log("🚀 STARTING FULL AI DATABASE INITIALIZATION");
	console.log("==========================================\n");

	try {
		// 1. Seed Master Data (Brands, Categories, Series)
		console.log("📌 STEP 1: Seeding Master Data...");
		await seedMasterData();
		console.log("\n✅ STEP 1 COMPLETE\n");

		// 2. Crawl and Seed Products (from markdown + AI extension)
		console.log("📌 STEP 2: Crawling & Generating Products...");
		// Arguments can be passed via process.argv if needed, using defaults for now
		await crawlProducts();
		console.log("\n✅ STEP 2 COMPLETE\n");

		// 3. Fill Image Gaps
		console.log("📌 STEP 3: Filling Missing Images...");
		await crawlMasterImages("all");
		console.log("\n✅ STEP 3 COMPLETE\n");

		console.log("==========================================");
		console.log("🎉 DATABASE INITIALIZATION COMPLETE");
		console.log("==========================================");
	} catch (error) {
		console.error("\n❌ FATAL ERROR DURING INITIALIZATION:", error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// Execute
initDb();
