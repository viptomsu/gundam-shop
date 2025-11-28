import { PackageX } from "lucide-react";

interface NoDataProps {
	message?: string;
}

export const NoData = ({ message = "No results found." }: NoDataProps) => {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground border border-dashed border-primary/20 bg-black/20 m-4 rounded-none clip-mecha-container">
			<PackageX className="h-12 w-12 mb-4 opacity-50 text-primary" />
			<p className="font-mono uppercase tracking-wider">{message}</p>
		</div>
	);
};
