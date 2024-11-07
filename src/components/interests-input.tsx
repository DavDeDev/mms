import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";
import React, { useRef, useEffect, type KeyboardEvent } from "react";

const MAX_INTERESTS = 5;
const MAX_INTEREST_LENGTH = 30;

interface InterestsInputProps {
	value: string[];
	onChange: (interests: string[]) => void;
}

export default function InterestsInput({
	value,
	onChange,
}: InterestsInputProps) {
	const [inputValue, setInputValue] = React.useState("");
	const [highlightedIndex, setHighlightedIndex] = React.useState<number | null>(
		null,
	);
	const [error, setError] = React.useState<string | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
		setHighlightedIndex(null);
		setError(null);
	};

	const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && inputValue.trim()) {
			e.preventDefault();
			if (inputValue.length > MAX_INTEREST_LENGTH) {
				setError(`Interest must be ${MAX_INTEREST_LENGTH} characters or less`);
			} else if (
				value.length < MAX_INTERESTS &&
				!value.includes(inputValue.trim())
			) {
				onChange([...value, inputValue.trim()]);
				setInputValue("");
				setError(null);
			} else if (value.length >= MAX_INTERESTS) {
				setError(`Maximum ${MAX_INTERESTS} interests allowed`);
			} else {
				setError("This interest already exists");
			}
		} else if (e.key === "Backspace" && !inputValue && value.length > 0) {
			e.preventDefault();
			if (highlightedIndex === null) {
				setHighlightedIndex(value.length - 1);
			} else {
				removeInterest(value[highlightedIndex]);
				setHighlightedIndex(null);
			}
		} else {
			setHighlightedIndex(null);
		}
	};

	const removeInterest = (interestToRemove: string) => {
		onChange(value.filter((interest) => interest !== interestToRemove));
		setHighlightedIndex(null);
		setError(null);
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
				<TooltipProvider>
					{value.map((interest, index) => (
						<Tooltip key={index}>
							<TooltipTrigger asChild>
								<div
									className={`flex items-center h-8 bg-secondary text-secondary-foreground rounded-md ${
										index === highlightedIndex ? "ring-2 ring-primary" : ""
									}`}
								>
									<span className="px-2 text-sm">{trimInterest(interest)}</span>
									<Button
										type="button"
										onClick={() => removeInterest(interest)}
										className="h-full px-2 hover:bg-destructive hover:text-destructive-foreground rounded-none rounded-r-md transition-colors"
										aria-label={`Remove ${interest}`}
										variant="secondary"
									>
										<X size={12} />
									</Button>
								</div>
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
						className="flex-grow h-8 outline-none bg-transparent text-sm min-w-[120px] leading-normal"
						maxLength={MAX_INTEREST_LENGTH}
					/>
				)}
			</div>
			{error && <p className="text-destructive text-sm mt-1">{error}</p>}
		</div>
	);
}
