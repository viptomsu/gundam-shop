"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AvatarUploaderProps {
	value?: string | null;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function AvatarUploader({
	value,
	onChange,
	disabled,
}: AvatarUploaderProps) {
	const [isUploading, setIsUploading] = useState(false);

	const uniqueId = `avatar-upload-${Math.random().toString(36).substr(2, 9)}`;

	const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = e.target.files?.[0];
			if (!file) return;

			setIsUploading(true);
			const formData = new FormData();
			formData.append("file", file);
			// Optional: Add folder specific for avatars if needed, e.g. "avatars"
			formData.append("folder", "avatars");

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const data = await response.json();
			onChange(data.secure_url);
			toast.success("Avatar updated");
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div className="flex flex-col items-center gap-4">
			<div
				className={cn(
					"relative w-32 h-32 overflow-hidden bg-muted border-2 border-primary/20 hover:border-primary/50 transition-colors group",
					"clip-mecha" // Using the existing mecha clip class
				)}>
				{value ? (
					<Image fill className="object-cover" alt="Avatar" src={value} />
				) : (
					<div className="flex h-full w-full items-center justify-center bg-secondary">
						<User className="h-12 w-12 text-muted-foreground" />
					</div>
				)}

				{/* Overlay */}
				<div
					className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
					onClick={() =>
						!disabled &&
						!isUploading &&
						document.getElementById(uniqueId)?.click()
					}>
					{isUploading ? (
						<Loader2 className="h-8 w-8 text-white animate-spin" />
					) : (
						<Camera className="h-8 w-8 text-white" />
					)}
				</div>
			</div>

			<input
				id={uniqueId}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={onUpload}
				disabled={disabled || isUploading}
			/>

			<Button
				type="button"
				variant="outline"
				size="sm"
				disabled={disabled || isUploading}
				onClick={() => document.getElementById(uniqueId)?.click()}
				className="clip-mecha">
				{isUploading ? "Uploading..." : "Change Avatar"}
			</Button>
		</div>
	);
}
