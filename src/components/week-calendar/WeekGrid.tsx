import type React from "react";
import TimeSlot from "./TimeSlot";

export interface MentorAvailability {
	cohort_mentor_id: number | null;
	day_of_week: string | null;
	end_time: string | null;
	id: number;
	start_time: string | null;
}

export interface CalendarConfig {
	showDates?: boolean;
	showWeekends?: boolean;
	showAllHours?: boolean;
	startHour?: number;
	endHour?: number;
}

export interface Event {
	id: string;
	title: string;
	day: number;
	startHour: number;
	duration: number;
	color: string;
}

interface WeekGridProps {
	currentDate: Date;
	config: CalendarConfig;
	mentorAvailability: MentorAvailability[];
}

export const WeekGrid: React.FC<WeekGridProps> = ({
	config,
	mentorAvailability,
}) => {
	const { showWeekends, startHour = 9, endHour = 19 } = config;

	const hours = Array.from(
		{ length: endHour - startHour + 1 },
		(_, i) => i + startHour,
	);

	const daysCount = showWeekends ? 7 : 5;
	const gridCols = showWeekends ? "grid-cols-8" : "grid-cols-6";

	const getAvailabilityForSlot = (day: number, hour: number) => {
		return mentorAvailability.filter((avail) => {
			if (!avail.day_of_week || !avail.start_time || !avail.end_time)
				return false;

			const dayMatch = Number.parseInt(avail.day_of_week) === day;
			const startHour = Number.parseInt(avail.start_time.split(":")[0]);
			const endHour = Number.parseInt(avail.end_time.split(":")[0]);

			return dayMatch && hour >= startHour && hour < endHour;
		});
	};

	return (
		<div
			className="grid "
			style={{
				gridTemplateColumns: `minmax(5rem, auto) repeat(${daysCount}, 1fr)`,
			}}
		>
			{/* Time labels column */}
			<div>
				{hours.map((hour) => (
					<div
						key={hour}
						className="mt-0 h-20 box-border flex items-start justify-end pr-2 text-muted-foreground relative"
					>
						<span className="text-sm absolute -top-2">
							{hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? "PM" : "AM"}
						</span>
					</div>
				))}
			</div>

			{/* Day columns */}
			{Array.from({ length: daysCount }).map((_, dayIndex) => (
				<div key={dayIndex} className="border-l">
					{hours.map((hour) => (
						<TimeSlot
							key={`${dayIndex}-${hour}`}
							// hour={hour}
							availability={getAvailabilityForSlot(dayIndex + 1, hour)}
						/>
					))}
				</div>
			))}
		</div>
	);
};
