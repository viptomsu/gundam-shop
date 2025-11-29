import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(url: string, publicId: string): Promise<string> {
	if (
		process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
		process.env.CLOUDINARY_API_KEY &&
		process.env.CLOUDINARY_API_SECRET
	) {
		try {
			const result = await cloudinary.uploader.upload(url, {
				public_id: publicId,
				overwrite: true,
			});
			console.log(`Uploaded ${publicId}: ${result.secure_url}`);
			return result.secure_url;
		} catch (error) {
			console.error(`Failed to upload ${publicId}:`, error);
			return url; // Fallback to original URL if upload fails
		}
	} else {
		console.warn(
			"Cloudinary credentials missing. Using placeholder/original URL."
		);
		return url;
	}
}

async function main() {
	console.log("Start seeding...");

	// 1. Cleanup (Order matters!)
	console.log("Cleaning up database...");
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.productVariant.deleteMany();
	await prisma.review.deleteMany();
	await prisma.product.deleteMany();
	await prisma.series.deleteMany();
	await prisma.category.deleteMany();
	await prisma.brand.deleteMany();
	await prisma.refreshToken.deleteMany();
	await prisma.user.deleteMany();

	// 2. Users
	console.log("Seeding Users...");
	const hashedPassword = await bcrypt.hash("123456", 10);

	const admin = await prisma.user.create({
		data: {
			email: "admin@gundam.com",
			password: hashedPassword,
			name: "Admin User",
			role: "ADMIN",
		},
	});

	const user = await prisma.user.create({
		data: {
			email: "user@gundam.com",
			password: hashedPassword,
			name: "Normal User",
			role: "USER",
		},
	});

	// 3. Catalog
	console.log("Seeding Catalog...");

	// Brands
	const bandaiLogo = await uploadImage(
		"https://1000logos.net/wp-content/uploads/2020/09/Bandai-Logo.png",
		"brand_bandai"
	);
	const tamiyaLogo = await uploadImage(
		"https://static.cdnlogo.com/logos/t/20/tamiya.svg",
		"brand_tamiya"
	);

	const bandai = await prisma.brand.create({
		data: { name: "Bandai", slug: "bandai", logo: bandaiLogo },
	});
	const tamiya = await prisma.brand.create({
		data: { name: "Tamiya", slug: "tamiya", logo: tamiyaLogo },
	});

	// Categories
	const hg = await prisma.category.create({
		data: { name: "High Grade (HG)", slug: "hg", description: "1/144 Scale" },
	});
	const mg = await prisma.category.create({
		data: { name: "Master Grade (MG)", slug: "mg", description: "1/100 Scale" },
	});
	const pg = await prisma.category.create({
		data: { name: "Perfect Grade (PG)", slug: "pg", description: "1/60 Scale" },
	});
	const tools = await prisma.category.create({
		data: { name: "Tools & Paints", slug: "tools" },
	});

	// Series
	const wfm = await prisma.series.create({
		data: {
			name: "Mobile Suit Gundam: The Witch from Mercury",
			slug: "witch-from-mercury",
		},
	});
	const seed = await prisma.series.create({
		data: { name: "Mobile Suit Gundam SEED", slug: "gundam-seed" },
	});

	// 4. Products
	console.log("Seeding Products...");

	// Product 1: HG Aerial
	const aerialImage = await uploadImage(
		"https://www.gundamplanet.com/media/catalog/product/h/g/hg-gundam-aerial-box-art.jpg",
		"product_hg_aerial"
	);
	const aerial = await prisma.product.create({
		data: {
			name: "HG Gundam Aerial",
			slug: "hg-gundam-aerial",
			description:
				"The protagonist unit from Mobile Suit Gundam: The Witch from Mercury.",
			grade: "HG",
			scale: "1/144",
			images: [aerialImage],
			brandId: bandai.id,
			seriesId: wfm.id,
			categories: { connect: [{ id: hg.id }] },
			variants: {
				create: {
					name: "Standard",
					price: new Prisma.Decimal(14.99),
					stock: 50,
					sku: "HG-AERIAL-001",
					image: aerialImage,
				},
			},
		},
	});

	// Product 2: MG Freedom 2.0
	const freedomImage = await uploadImage(
		"https://www.gundamplanet.com/media/catalog/product/m/g/mg-freedom-gundam-ver-2-0-box-art.jpg",
		"product_mg_freedom_2"
	);
	const freedom = await prisma.product.create({
		data: {
			name: "MG Freedom Gundam Ver. 2.0",
			slug: "mg-freedom-2-0",
			description:
				"A Master Grade kit of the Freedom Gundam with updated proportions and articulation.",
			grade: "MG",
			scale: "1/100",
			images: [freedomImage],
			brandId: bandai.id,
			seriesId: seed.id,
			categories: { connect: [{ id: mg.id }] },
			variants: {
				create: [
					{
						name: "Standard",
						price: new Prisma.Decimal(45.0),
						stock: 20,
						sku: "MG-FREEDOM-001",
						image: freedomImage,
					},
					{
						name: "Silver Coating",
						price: new Prisma.Decimal(80.0),
						stock: 5,
						sku: "MG-FREEDOM-SILVER",
						image: freedomImage, // Ideally a different image, but reusing for now
					},
				],
			},
		},
	});

	// Product 3: MG Barbatos (Sale)
	const barbatosImage = await uploadImage(
		"https://www.gundamplanet.com/media/catalog/product/m/g/mg-gundam-barbatos-box-art.jpg",
		"product_mg_barbatos"
	);
	const yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	const nextWeek = new Date();
	nextWeek.setDate(nextWeek.getDate() + 7);

	const barbatos = await prisma.product.create({
		data: {
			name: "MG Gundam Barbatos",
			slug: "mg-gundam-barbatos",
			description: "The 4th form of Gundam Barbatos from Iron-Blooded Orphans.",
			grade: "MG",
			scale: "1/100",
			images: [barbatosImage],
			brandId: bandai.id,
			// No series for IBO seeded yet, leaving null or could add IBO series
			categories: { connect: [{ id: mg.id }] },
			variants: {
				create: {
					name: "Standard",
					price: new Prisma.Decimal(50.0),
					salePrice: new Prisma.Decimal(40.0),
					saleStartDate: yesterday,
					saleEndDate: nextWeek,
					stock: 15,
					sku: "MG-BARBATOS-001",
					image: barbatosImage,
				},
			},
		},
	});

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
