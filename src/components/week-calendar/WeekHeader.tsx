import type React from "react";
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

interface WeekHeaderProps {
	currentDate: Date;
	config: CalendarConfig;
}

const DAYS_OF_WEEK = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

export const WeekHeader: React.FC<WeekHeaderProps> = ({
	currentDate,
	config,
}) => {
	const { showDates, showWeekends } = config;
	const daysToShow = showWeekends ? DAYS_OF_WEEK : DAYS_OF_WEEK.slice(0, 5);

	const getWeekDays = () => {
		const days = [];
		const start = new Date(currentDate);
		// Find Monday
		while (start.getDay() !== 1) {
			start.setDate(start.getDate() - 1);
		}

		for (let i = 0; i < daysToShow.length; i++) {
			const date = new Date(start);
			date.setDate(start.getDate() + i);
			days.push(date);
		}
		return days;
	};

	const isToday = (date: Date) => {
		const today = new Date();
		return date.toDateString() === today.toDateString();
	};


	return (
		<div
			className="grid"
			style={{
				gridTemplateColumns: `minmax(5rem, auto) repeat(${daysToShow.length}, 1fr)`,
			}}
		>
			{/* First column header - matching time labels width */}
			<div />
			{showDates
				? getWeekDays().map((date, index) => (
						<div
							key={index}
							className={`p-4 text-center border-l border-b ${
								isToday(date) ? "" : ""
							}`}
						>
							<div className="text-sm font-medium ">
								{date.toLocaleString("default", { weekday: "short" })}
							</div>
							<div
								className={`text-xl font-semibold ${isToday(date) ? "text-blue-600" : "text-muted"}`}
							>
								{date.getDate()}
							</div>
						</div>
					))
				: daysToShow.map((day, index) => (
						<div key={index} className="p-4 text-center border-l border-b">
							<div className="text-sm font-medium ">{day}</div>
						</div>
					))}
		</div>
	);
};
