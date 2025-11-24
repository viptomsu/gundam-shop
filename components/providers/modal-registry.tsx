"use client";

import { useEffect } from "react";
import { useModalStore } from "@/hooks/use-modal-store";
import { ModalIds } from "@/types/modal";

interface ModalRegistryProps {
	modals: Partial<Record<ModalIds | string, React.ComponentType<any>>>;
}

export const ModalRegistry: React.FC<ModalRegistryProps> = ({ modals }) => {
	const { register, unregister } = useModalStore();

	useEffect(() => {
		Object.entries(modals).forEach(([id, component]) => {
			if (component) {
				register(id, component);
			}
		});

		return () => {
			Object.keys(modals).forEach((id) => {
				unregister(id);
			});
		};
	}, [modals, register, unregister]);

	return null;
};
