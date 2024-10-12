"use client";

import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";
import React, { type KeyboardEvent, useRef, useEffect } from "react";
import { Button } from "./ui/button";

const MAX_INTERESTS = 5;
const MAX_INTEREST_LENGTH = 20;

interface InterestsInputProps {
	value: string[];
	onChange: (value: string[]) => void;
}

export default function InterestsInput({
	value,
	onChange,
}: InterestsInputProps) {
	const [inputValue, setInputValue] = React.useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim()) {
			e.preventDefault();
			if (value.length < MAX_INTERESTS && !value.includes(inputValue.trim())) {
				onChange([...value, inputValue.trim()]);
				setInputValue("");
			}
		} else if (e.key === "Backspace" && !inputValue && value.length > 0) {
			removeInterest(value[value.length - 1]);
		}
	};

	const removeInterest = (interestToRemove: string) => {
		onChange(value.filter((interest) => interest !== interestToRemove));
	};

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const trimInterest = (interest: string) => {
		if (interest.length <= MAX_INTEREST_LENGTH) return interest;
		return `${interest.slice(0, MAX_INTEREST_LENGTH)}...`;
	};

	return (
		<div className="w-full">
			<div className="flex flex-wrap items-center gap-2 p-2 border rounded-md min-h-[42px]">
				{/* TODO: Tooltip is not workink */}
				<TooltipProvider>
					{value.map((interest, index) => (
						<Tooltip key={index}>
							<TooltipTrigger asChild>
								<Badge variant="secondary" className="text-sm">
									{trimInterest(interest)}
									<Button
										onClick={() => removeInterest(interest)}
										className="ml-1 p-0 h-0"
										aria-label={`Remove ${interest}`}
										variant="link"
									>
										<X size={12} />
									</Button>
								</Badge>
							</TooltipTrigger>
							<TooltipContent>
								<p>{interest}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</TooltipProvider>
				{value.length < MAX_INTERESTS && (
					<input
						ref={inputRef}
						type="text"
						placeholder="Type an interest and press Enter"
						value={inputValue}
						onChange={handleInputChange}
						onKeyDown={handleInputKeyDown}
						className="flex-grow outline-none bg-transparent text-sm min-w-[120px]"
					/>
				)}
			</div>
		</div>
	);
}
