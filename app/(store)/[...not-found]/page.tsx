import { notFound } from "next/navigation";

// This catch-all route captures all unmatched store routes
// and triggers the not-found.tsx in the store layout
export default function CatchAllPage() {
	notFound();
}
