import { Button } from "@/components/ui/button";
import { DayOfWeek } from "@/types/enums";
import { cn } from "@/utils/cn";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

interface WeekDayPickerProps {
	value: DayOfWeek;
	onChange: (day: DayOfWeek) => void;
	className?: string;
	showBusinessDaysOnly?: boolean;
}

export default function WeekDayPicker({
	value,
	onChange,
	className,
	showBusinessDaysOnly = false,
}: WeekDayPickerProps) {
	const daysToShow = showBusinessDaysOnly
		? [
				DayOfWeek.monday,
				DayOfWeek.tuesday,
				DayOfWeek.wednesday,
				DayOfWeek.thursday,
				DayOfWeek.friday,
			]
		: Object.values(DayOfWeek);

	const getDayLabel = (day: DayOfWeek) => {
		if (day === DayOfWeek.tuesday || day === DayOfWeek.thursday) {
			return day.slice(0, 2).toUpperCase();
		}
		return day[0].toUpperCase();
	};

	const getFullDayName = (day: DayOfWeek) => {
		return day.charAt(0).toUpperCase() + day.slice(1);
	};

	return (
		<TooltipProvider>
			<div className={cn("flex flex-wrap gap-2", className)}>
				{daysToShow.map((day) => (
					<Tooltip key={day}>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant={value === day ? "default" : "outline"}
								onClick={() => onChange(day)}
								className="w-10 h-10 rounded-full p-0"
							>
								{getDayLabel(day)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>{getFullDayName(day)}</p>
						</TooltipContent>
					</Tooltip>
				))}
			</div>
		</TooltipProvider>
	);
}
