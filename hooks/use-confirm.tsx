import { useModalStore } from "@/hooks/use-modal-store";
import { ModalIds } from "@/types/modal";

export const useConfirm = () => {
	const { show } = useModalStore();

	const confirm = (
		title = "Are you sure?",
		description = "This action cannot be undone."
	) => {
		return show(ModalIds.CONFIRM, {
			title,
			description,
		});
	};

	return confirm;
};
