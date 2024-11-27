import { addDays, startOfWeek } from "date-fns";
import type React from "react";
import { ScrollArea } from "../ui/scroll-area";
import CalendarHeader from "./CalendarHeader";
import EventLayer from "./EventLayer";
import TimeGrid from "./TimeGrid";
import TimeLabels from "./TimeLabels";

interface WeekCalendarProps {
	events: CalendarEvent[];
}
export interface CalendarEvent {
	id: number;
	title: string;
	start: Date;
	end: Date;
	color: string;
}
const WeekCalendar: React.FC<WeekCalendarProps> = ({
	events,
}: WeekCalendarProps) => {
	const today = new Date();
	const weekStart = startOfWeek(today);
	const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
	const hours = Array.from({ length: 24 }, (_, i) => i);

	const getEventPosition = (event: CalendarEvent) => {
		const startHour = event.start.getHours();
		const startMinutes = event.start.getMinutes();
		const endHour = event.end.getHours();
		const endMinutes = event.end.getMinutes();

		const top = (startHour + startMinutes / 60) * 60;
		const height =
			(endHour + endMinutes / 60 - (startHour + startMinutes / 60)) * 60;
		const dayIndex = event.start.getDay();

		return {
			top: `${top}px`,
			height: `${height}px`,
			left: `${(100 / 7) * dayIndex}%`,
			width: `${100 / 7}%`,
		};
	};

	return (
		<div className="overflow-hidden grow flex flex-col">
			<CalendarHeader days={days} />

			<ScrollArea className=" h-full flex-1 inset-0">
				<div className="relative flex">
					<TimeLabels hours={hours} />
					<TimeGrid hours={hours} />
					<EventLayer events={events} getEventPosition={getEventPosition} />
				</div>
			</ScrollArea>
		</div>
	);
};

export default WeekCalendar;
