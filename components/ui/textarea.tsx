import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"border-white/10 bg-black/20 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:shadow-[0_0_10px_rgba(6,182,212,0.5)] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-none border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-2 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className
			)}
			{...props}
		/>
	);
}

export { Textarea };
