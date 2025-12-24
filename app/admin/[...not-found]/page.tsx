import { notFound } from "next/navigation";

// This catch-all route captures all unmatched admin routes
// and triggers the not-found.tsx in the admin layout
export default function CatchAllPage() {
	notFound();
}
