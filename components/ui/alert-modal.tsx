"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	resolve?: (value: boolean) => void;
	loading?: boolean;
	title?: string;
	description?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	resolve,
	loading,
	title = "Are you sure?",
	description = "This action cannot be undone.",
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	const handleConfirm = () => {
		if (resolve) resolve(true);
		onClose();
	};

	const handleCancel = () => {
		if (resolve) resolve(false);
		onClose();
	};

	return (
		<Modal
			title={title}
			description={description}
			isOpen={isOpen}
			onClose={handleCancel}>
			<div className="pt-6 space-x-2 flex items-center justify-end w-full">
				<Button disabled={loading} variant="outline" onClick={handleCancel}>
					Cancel
				</Button>
				<Button
					disabled={loading}
					variant="destructive"
					onClick={handleConfirm}>
					Continue
				</Button>
			</div>
		</Modal>
	);
};
