import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"bg-black/20 placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-none border px-3 py-2 text-base shadow-xs outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm tech-input-base",
				className
			)}
			{...props}
		/>
	);
}

export { Textarea };
