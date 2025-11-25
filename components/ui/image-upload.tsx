"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string[]) => void;
	onRemove: (value: string) => void;
	value: string[];
	folder?: string;
}

export function ImageUpload({
	disabled,
	onChange,
	onRemove,
	value,
	folder,
}: ImageUploadProps) {
	const [isUploading, setIsUploading] = useState(false);

	const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const file = e.target.files?.[0];
			if (!file) return;

			setIsUploading(true);
			const formData = new FormData();
			formData.append("file", file);
			if (folder) {
				formData.append("folder", folder);
			}

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload failed");
			}

			const data = await response.json();
			onChange([...value, data.secure_url]);
			toast.success("Image uploaded");
		} catch (error) {
			toast.error("Something went wrong");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div>
			<div className="mb-4 flex items-center gap-4">
				{value.map((url) => (
					<div
						key={url}
						className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
						<div className="z-10 absolute top-2 right-2">
							<Button
								type="button"
								onClick={() => onRemove(url)}
								variant="outline"
								color="destructive"
								size="icon"
								className="clip-mecha rounded-none">
								<X className="h-4 w-4" />
							</Button>
						</div>
						<Image fill className="object-cover" alt="Image" src={url} />
					</div>
				))}
			</div>
			<div className="flex items-center gap-4">
				<Button
					type="button"
					disabled={disabled || isUploading}
					variant="default"
					color="secondary"
					onClick={() => document.getElementById("image-upload")?.click()}>
					<ImagePlus className="h-4 w-4 mr-2" />
					Upload an Image
				</Button>
				<input
					id="image-upload"
					type="file"
					accept="image/*"
					className="hidden"
					onChange={onUpload}
					disabled={disabled || isUploading}
				/>
			</div>
		</div>
	);
}
