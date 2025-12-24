import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
	src?: string | null;
	alt?: string;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const sizes = {
	sm: {
		container: "h-8 w-8",
		icon: "h-4 w-4",
	},
	md: {
		container: "h-10 w-10",
		icon: "h-5 w-5",
	},
	lg: {
		container: "h-12 w-12",
		icon: "h-6 w-6",
	},
};

export function UserAvatar({
	src,
	alt = "User avatar",
	size = "md",
	className,
}: UserAvatarProps) {
	const { container, icon } = sizes[size];

	return (
		<Avatar className={cn(container, className)}>
			<AvatarImage src={src || undefined} alt={alt} className="object-cover" />
			<AvatarFallback className="bg-primary/10 border border-primary/20">
				<User className={cn("text-primary", icon)} />
			</AvatarFallback>
		</Avatar>
	);
}
