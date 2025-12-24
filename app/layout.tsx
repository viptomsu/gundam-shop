import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

import { ModalRegistry } from "@/components/providers/modal-registry";
import { AlertModal } from "@/components/ui/alert-modal";
import { ModalIds } from "@/types/modal";
import { Chakra_Petch, Share_Tech_Mono } from "next/font/google";

export const metadata: Metadata = {
	title: {
		default: "G-RETICLE | Premium Gunpla Store",
		template: "%s | G-RETICLE",
	},
	description:
		"Lock on your next target. Premium Gunpla collection from High Grade to Perfect Grade. Where precision engineering locks onto artistic expression.",
	keywords: [
		"Gunpla",
		"Gundam",
		"Model Kits",
		"Bandai",
		"High Grade",
		"Master Grade",
		"Perfect Grade",
		"Real Grade",
		"Mobile Suit",
		"Plastic Model",
	],
	authors: [{ name: "G-RETICLE" }],
	creator: "G-RETICLE",
	icons: {
		icon: "/logo-eye.ico",
		shortcut: "/logo-eye.ico",
		apple: "/logo-eye.png",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		siteName: "G-RETICLE",
		title: "G-RETICLE | Premium Gunpla Store",
		description:
			"Lock on your next target. Premium Gunpla collection from High Grade to Perfect Grade.",
		images: [
			{
				url: "/logo-eye.png",
				width: 512,
				height: 512,
				alt: "G-RETICLE Logo",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "G-RETICLE | Premium Gunpla Store",
		description:
			"Lock on your next target. Premium Gunpla collection from High Grade to Perfect Grade.",
		images: ["/logo-eye.png"],
	},
	robots: {
		index: true,
		follow: true,
	},
};

const chakraPetch = Chakra_Petch({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
	variable: "--font-chakra",
});

const shareTechMono = Share_Tech_Mono({
	subsets: ["latin"],
	weight: ["400"],
	variable: "--font-tech-mono",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${chakraPetch.variable} ${shareTechMono.variable} font-sans antialiased`}>
				<Providers>
					<ModalRegistry modals={{ [ModalIds.CONFIRM]: AlertModal }} />
					{children}
				</Providers>
			</body>
		</html>
	);
}
