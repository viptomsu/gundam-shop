import { Providers } from "@/components/providers";
import "./globals.css";

import { ModalRegistry } from "@/components/providers/modal-registry";
import { AlertModal } from "@/components/ui/alert-modal";
import { ModalIds } from "@/types/modal";
import { Chakra_Petch, Share_Tech_Mono } from "next/font/google";

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
