"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

import { cn } from "@/utils/cn";

const Separator = React.forwardRef<
	React.ElementRef<typeof SeparatorPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
	(
		{ className, orientation = "horizontal", decorative = true, ...props },
		ref,
	) => (
		<SeparatorPrimitive.Root
			ref={ref}
			decorative={decorative}
			orientation={orientation}
			className={cn(
				"shrink-0 bg-border",
				orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
				className,
			)}
			{...props}
		/>
	),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

interface SeparatorWithTextProps extends React.HTMLAttributes<HTMLDivElement> {
	orientation?: "horizontal" | "vertical";
	text?: string;
}

const SeparatorWithText = ({
	orientation = "horizontal",
	text,
	className,
	...props
}: SeparatorWithTextProps) => {
	const isVertical = orientation === "vertical";

	return (
		<div
			className={cn(
				"flex items-center",
				isVertical ? "flex-col h-full" : "w-full",
				className,
			)}
			{...props}
		>
			<Separator
				orientation={orientation}
				className={cn(isVertical ? "h-full" : "flex-grow", "shrink")}
			/>
			{text && (
				<span
					className={cn(
						"px-2 text-sm text-muted-foreground",
						isVertical && "py-2 writing-mode-vertical",
					)}
				>
					{text}
				</span>
			)}
			<Separator
				orientation={orientation}
				className={cn(isVertical ? "h-full" : "flex-grow", "shrink")}
			/>
		</div>
	);
};

export { Separator, SeparatorWithText };
