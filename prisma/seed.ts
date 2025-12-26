import {
	PrismaClient,
	Prisma,
	Role,
	OrderStatus,
	PaymentStatus,
	PaymentMethod,
} from "@prisma/client";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { faker } from "@faker-js/faker";

import { BRANDS } from "./seed-data/brands";
import { CATEGORIES } from "./seed-data/categories";
import { SERIES } from "./seed-data/series";
import { PRODUCT_TEMPLATES } from "./seed-data/products";
import { GUNDAM_SCALES } from "../config/constants";

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
			// Check if image already exists to avoid re-uploading every time (optional optimization)
			// For seed, valid to just upload/overwrite or use optimized logic.
			// Here we keep it simple.
			const result = await cloudinary.uploader.upload(url, {
				public_id: publicId,
				overwrite: true,
			});
			console.log(`Uploaded ${publicId}: ${result.secure_url}`);
			return result.secure_url;
		} catch (error) {
			console.error(`Failed to upload ${publicId}:`, error);
			return url; // Fallback to original URL
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

	// 1. Cleanup
	console.log("Cleaning up database...");
	await prisma.orderItem.deleteMany();
	await prisma.order.deleteMany();
	await prisma.review.deleteMany();
	await prisma.productVariant.deleteMany();
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
			role: Role.ADMIN,
			avatar: faker.image.avatar(),
		},
	});

	const demoUser = await prisma.user.create({
		data: {
			email: "user@gundam.com",
			password: hashedPassword,
			name: "Demo User",
			role: Role.USER,
			avatar: faker.image.avatar(),
			phone: faker.phone.number(),
			address: faker.location.streetAddress({ useFullAddress: true }),
		},
	});

	const otherUsers = [];
	for (let i = 0; i < 8; i++) {
		otherUsers.push(
			await prisma.user.create({
				data: {
					email: faker.internet.email(),
					password: hashedPassword,
					name: faker.person.fullName(),
					role: Role.USER,
					avatar: faker.image.avatar(),
					phone: faker.phone.number(),
					address: faker.location.streetAddress({ useFullAddress: true }),
				},
			})
		);
	}
	const allUsers = [demoUser, ...otherUsers];

	// 3. Catalog
	console.log("Seeding Catalog...");

	// Create Brands
	const brandMap = new Map();
	for (const b of BRANDS) {
		// Real upload optional, using faker/placeholder for speed if no logo provided or failing
		const item = await prisma.brand.create({
			data: {
				name: b.name,
				slug: b.slug,
				description: b.description,
				logo: b.logo, // In real app, consider uploading this to cloudinary
			},
		});
		brandMap.set(b.slug, item.id);
	}

	// Create Categories
	const catMap = new Map();
	for (const c of CATEGORIES) {
		const item = await prisma.category.create({
			data: {
				name: c.name,
				slug: c.slug,
				description: c.description,
			},
		});
		catMap.set(c.slug, item.id);
	}

	// Create Series
	const seriesMap = new Map();
	for (const s of SERIES) {
		const item = await prisma.series.create({
			data: {
				name: s.name,
				slug: s.slug,
				description: s.description,
				image: faker.image.urlLoremFlickr({ category: "robot" }),
			},
		});
		seriesMap.set(s.slug, item.id);
	}

	// 4. Products
	console.log("Seeding Products...");
	const products = [];

	for (const t of PRODUCT_TEMPLATES) {
		// Find IDs
		const brandId = brandMap.get(t.brand);
		const seriesId = t.series ? seriesMap.get(t.series) : null;
		const catIds = t.cat
			.map((slug) => catMap.get(slug))
			.filter((id) => id !== undefined);

		// Upload placeholder image (using a consistent placeholder service or just a string)
		// For 'realistic' look without real upload, we can use Unsplash source or placeholders
		const productImg = faker.image.urlLoremFlickr({ category: "robot" });

		const product = await prisma.product.create({
			data: {
				name: t.name,
				slug: faker.helpers
					.slugify(t.name + "-" + faker.string.alphanumeric(4))
					.toLowerCase(),
				description: faker.commerce.productDescription() + ` ${t.name}`,
				brandId: brandId,
				seriesId: seriesId,
				categories: {
					connect: catIds.map((id) => ({ id })),
				},
				images: [productImg, faker.image.urlLoremFlickr({ category: "robot" })],
				grade: t.grade,
				scale: t.scale,
				variants: {
					create: t.variants.map((v) => ({
						name: v.name,
						price: new Prisma.Decimal(v.price),
						stock: v.stock,
						sku: faker.string.alphanumeric(8).toUpperCase(),
						image: productImg,
					})),
				},
			},
			include: { variants: true }, // Include to get variant ID for orders later
		});
		products.push(product);
	}

	// 5. Orders & Reviews
	console.log("Seeding Orders & Reviews...");

	for (const u of allUsers) {
		// Create 0-3 orders per user
		const orderCount = faker.number.int({ min: 0, max: 3 });
		for (let i = 0; i < orderCount; i++) {
			const status = faker.helpers.arrayElement(Object.values(OrderStatus));
			const items = faker.helpers.arrayElements(
				products,
				faker.number.int({ min: 1, max: 3 })
			);

			let subtotal = 0;
			const orderItemsData = items.map((prod) => {
				const variant = prod.variants[0];
				const qty = faker.number.int({ min: 1, max: 2 });
				const price = Number(variant.price);
				subtotal += price * qty;
				return {
					variantId: variant.id,
					quantity: qty,
					price: new Prisma.Decimal(price),
					originalPrice: new Prisma.Decimal(price),
				};
			});

			await prisma.order.create({
				data: {
					userId: u.id,
					orderNumber: `#ORD-${faker.string.numeric(6)}`,
					guestName: u.name || "Guest",
					guestEmail: u.email,
					guestPhone: u.phone || "0000000000",
					shippingAddress: u.address || "Unknown Address",
					subtotal: new Prisma.Decimal(subtotal),
					totalAmount: new Prisma.Decimal(subtotal + 5), // +5 shipping
					shippingFee: new Prisma.Decimal(5),
					status: status,
					paymentStatus:
						status === OrderStatus.DELIVERED
							? PaymentStatus.PAID
							: PaymentStatus.PENDING,
					paymentMethod: PaymentMethod.COD,
					orderItems: {
						create: orderItemsData,
					},
				},
			});
		}

		// Create 0-5 reviews per user for random products
		const reviewCount = faker.number.int({ min: 0, max: 5 });
		const reviewedProducts = faker.helpers.arrayElements(products, reviewCount);

		for (const prod of reviewedProducts) {
			await prisma.review.create({
				data: {
					userId: u.id,
					productId: prod.id,
					rating: faker.number.int({ min: 3, max: 5 }),
					comment: faker.lorem.sentence(),
				},
			});
		}
	}

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
