"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/components/providers/modal-provider";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster />
			<ModalProvider />
		</QueryClientProvider>
	);
}
