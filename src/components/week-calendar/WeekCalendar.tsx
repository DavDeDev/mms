"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { WeekGrid } from "./WeekGrid";
import { WeekHeader } from "./WeekHeader";
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
interface WeeklyCalendarProps {
	mentorAvailability?: MentorAvailability[];
	config?: CalendarConfig;
}

const defaultConfig: CalendarConfig = {
	showDates: false,
	showWeekends: false,
	startHour: 9,
	endHour: 19, // 7 PM
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
	mentorAvailability = [],
	config = defaultConfig,
}) => {
	const [currentDate, setCurrentDate] = useState(new Date());
	const finalConfig = { ...defaultConfig, ...config };

	const navigateWeek = (direction: "prev" | "next") => {
		const newDate = new Date(currentDate);
		newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
		setCurrentDate(newDate);
	};

	return (
		<div>
			{finalConfig.showDates && (
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-semibold ">
						{currentDate.toLocaleString("default", {
							month: "long",
							year: "numeric",
						})}
					</h2>
					<div className="flex gap-2">
						<button
							onClick={() => navigateWeek("prev")}
							className="p-2 text-muted hover:text-primary hover:bg-muted rounded-full transition-colors"
						>
							<ChevronLeft className="w-5 h-5 " />
						</button>
						<button
							onClick={() => navigateWeek("next")}
							className="p-2 text-muted hover:text-primary hover:bg-muted rounded-full transition-colors"
						>
							<ChevronRight className="w-5 h-5" />
						</button>
					</div>
				</div>
			)}

			<div className="min-w-[800px]">
				<WeekHeader currentDate={currentDate} config={finalConfig} />
				<WeekGrid
					currentDate={currentDate}
					config={finalConfig}
					mentorAvailability={mentorAvailability}
				/>
			</div>
		</div>
	);
};

export default WeeklyCalendar;
