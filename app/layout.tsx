import { Providers } from "@/components/providers";
import "./globals.css";

import { ModalRegistry } from "@/components/providers/modal-registry";
import { AlertModal } from "@/components/ui/alert-modal";
import { ModalIds } from "@/types/modal";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<ModalRegistry modals={{ [ModalIds.CONFIRM]: AlertModal }} />
					{children}
				</Providers>
			</body>
		</html>
	);
}
