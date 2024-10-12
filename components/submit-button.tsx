"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<typeof Button> & {
	pendingText?: string;
};

export function SubmitButton({
	children,
	pendingText = "Submitting...",
	...props
}: Props) {
	// https://react.dev/reference/react-dom/hooks/useFormStatus
	const { pending } = useFormStatus();

	return (
		<Button type="submit" aria-disabled={pending} {...props}>
			{pending ? (
				<div className="flex gap-1">
					<Loader2
						className="animate-spin text-foreground-muted mt-0.5"
						size={16}
					/>
					<span>{pendingText}</span>
				</div>
			) : (
				children
			)}
		</Button>
	);
}
