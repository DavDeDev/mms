"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CopyTextProps {
	children: string;
	className?: string;
}

export default function CopyText({ children, className }: CopyTextProps) {
	const [isCopied, setIsCopied] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(children);
			setIsCopied(true);
			timeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<Tooltip open={isCopied}>
			<TooltipTrigger asChild>
				<button
					className={cn(
						"group flex items-center justify-between space-x-2 w-full",
						" text-sm text-muted-foreground bg-muted/40",
						"transition-colors duration-200 ease-in-out",
						"hover:bg-muted",

						className,
					)}
					onClick={copyToClipboard}
				>
					<span className=" truncate">{children}</span>
					<span className="flex-shrink-0 text-muted-foreground/60 group-hover:text-muted-foreground">
						{isCopied ? (
							<Check className="h-4 w-4" />
						) : (
							<Copy className="h-4 w-4" />
						)}
					</span>
				</button>
			</TooltipTrigger>
			<TooltipContent side="top" className="bg-primary text-primary-foreground">
				<p>Copied!</p>
			</TooltipContent>
		</Tooltip>
	);
}
