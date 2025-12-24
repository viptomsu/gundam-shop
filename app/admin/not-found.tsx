"use client";

import { NotFound } from "@/components/ui/not-found";

export default function AdminNotFound() {
	return (
		<div className="flex items-center justify-center min-h-[calc(100vh-2rem)]">
			<NotFound
				title="Admin Page Not Found"
				description="The admin resource you're looking for doesn't exist or you may not have permission to access it."
				linkText="Back to Dashboard"
				linkHref="/admin"
			/>
		</div>
	);
}
