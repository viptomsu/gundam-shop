"use client";

import { useModalStore } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
	const [isMounted, setIsMounted] = useState(false);
	const { modals, hide } = useModalStore();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<>
			{Object.values(modals).map((modal) => {
				const { id, isOpen, component: Component, args } = modal;

				if (!isOpen || !Component) return null;

				return (
					<Component
						key={id}
						isOpen={isOpen}
						onClose={() => hide(id)}
						{...args}
					/>
				);
			})}
		</>
	);
};
