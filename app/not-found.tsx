import { NotFound } from "@/components/ui/not-found";

export default function GlobalNotFound() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-background">
			<NotFound
				title="Page Not Found"
				description="Sorry, we couldn't find the page you're looking for."
				linkText="Return Home"
				linkHref="/"
			/>
		</div>
	);
}
