import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
	reactStrictMode: false,
	env: {
		NEXT_PUBLIC_APP_VERSION: packageJson.version,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "*",
			},
		],
	},
};

export default nextConfig;
