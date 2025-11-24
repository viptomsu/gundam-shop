import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col">
			<header className="border-b">
				<div className="flex h-16 items-center px-4">
					<div className="ml-auto flex items-center space-x-4">
						<Button asChild variant="ghost">
							<Link href="/admin/products">Products</Link>
						</Button>
						<Button asChild variant="ghost">
							<Link href="/">Home</Link>
						</Button>
					</div>
				</div>
			</header>
			<div className="flex-1 space-y-4 p-8 pt-6">{children}</div>
		</div>
	);
}
