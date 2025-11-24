import { PackageX } from "lucide-react";

interface NoDataProps {
	message?: string;
}

export const NoData = ({ message = "No results found." }: NoDataProps) => {
	return (
		<div className="flex flex-col items-center justify-center h-full p-8 text-muted-foreground">
			<PackageX className="h-12 w-12 mb-4 opacity-50" />
			<p className="text-lg font-medium">{message}</p>
		</div>
	);
};
