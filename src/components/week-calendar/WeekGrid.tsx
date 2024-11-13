import type { getCohortMentorsAvailability } from "@/queries/cached-queries";
import type React from "react";
import { TimeSlot } from "./TimeSlot";
import type { CalendarConfig } from "./WeekCalendar";

interface WeekGridProps {
	currentDate: Date;
	config: CalendarConfig;
	mentorAvailability: Awaited<ReturnType<typeof getCohortMentorsAvailability>>;
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

	// Helper to map days of the week to indices
	const dayMapping: Record<string, number> = {
		monday: 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6,
		sunday: 7,
	};

	// Adjusted availability checker with day and hour filtering
	const getAvailabilityForSlot = (day: number, hour: number) => {
		return mentorAvailability.filter((avail) => {
			if (!avail.day_of_week || !avail.start_time || !avail.end_time)
				return false;

			const dayMatch = dayMapping[avail.day_of_week.toLowerCase()] === day;
			const startHour = Number.parseInt(avail.start_time.split(":")[0], 10);
			const endHour = Number.parseInt(avail.end_time.split(":")[0], 10);

			return dayMatch && hour >= startHour && hour < endHour;
		});
	};

	return (
		<div
			className={`grid ${gridCols}`}
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
							availabilities={getAvailabilityForSlot(dayIndex + 1, hour)}
						/>
					))}
				</div>
			))}
		</div>
	);
};
