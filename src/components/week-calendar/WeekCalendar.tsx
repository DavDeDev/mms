"use client";
import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
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
			{finalConfig.showDates ? (
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-semibold ">
						{currentDate.toLocaleString("default", {
							month: "long",
							year: "numeric",
						})}
					</h2>

					<div className="flex gap-4">
						<Link href={`${window.location.pathname}/add`}>
							<Button className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
								<PlusIcon className="h-4 w-4" />
								Add your availability
							</Button>
						</Link>
						<div className="flex gap-2">
							<Button
								onClick={() => navigateWeek("prev")}
								variant="outline"
								size="icon"
							>
								<ChevronLeft />
							</Button>
							<Button
								onClick={() => navigateWeek("next")}
								variant="outline"
								size="icon"
							>
								<ChevronRight />
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className="w-full flex p-4">
					<Link href={`${window.location.pathname}/add`}>
						<Button className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
							<PlusIcon className="h-4 w-4" />
							Add your availability
						</Button>
					</Link>
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
