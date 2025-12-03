import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ModalRegistry } from "@/components/providers/modal-registry";
import { BulkSaleModal } from "@/components/modals/bulk-sale-modal";
import { ModalIds } from "@/types/modal";

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-full relative">
			<ModalRegistry modals={{ [ModalIds.BULK_SALE_MODAL]: BulkSaleModal }} />
			<div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-gray-900">
				<AdminSidebar />
			</div>
			<main className="md:pl-72">
				{/* Header can go here if we want a top bar for user profile etc, but for now just content */}
				<div className="p-4">{children}</div>
			</main>
		</div>
	);
}
