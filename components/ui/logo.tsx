import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
	href?: string;
	size?: "sm" | "md" | "lg";
	showText?: boolean;
	textClassName?: string;
	suffix?: React.ReactNode;
	className?: string;
}

export function Logo({
	href = "/",
	size = "md",
	showText = true,
	textClassName,
	suffix,
	className,
}: LogoProps) {
	const sizes = {
		sm: { image: 32, text: "text-lg" },
		md: { image: 40, text: "text-xl" },
		lg: { image: 48, text: "text-2xl" },
	};

	const { image, text } = sizes[size];

	const content = (
		<>
			<Image src="/logo-eye.png" alt="Logo" width={image} height={image} />
			{showText && (
				<span
					className={cn(
						"font-bold tracking-tighter font-display uppercase",
						text,
						textClassName
					)}>
					<span className="text-primary">G</span>-RETICLE
				</span>
			)}
			{suffix}
		</>
	);

	return (
		<Link href={href} className={cn("flex items-center gap-2", className)}>
			{content}
		</Link>
	);
}
