"use client";

import { NotFound } from "@/components/ui/not-found";

export default function StoreNotFound() {
	return (
		<NotFound
			title="Page Not Found"
			description="Looks like this mobile suit has left the hangar. The page you're searching for doesn't exist or has been moved."
			linkText="Return to Homepage"
			linkHref="/"
		/>
	);
}
