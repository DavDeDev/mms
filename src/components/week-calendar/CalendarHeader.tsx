import { format } from "date-fns";
import type React from "react";

interface CalendarHeaderProps {
	days: Date[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ days }) => (
	<div className="flex border-b">
		<div className="w-16 shrink-0" />
		{days.map((day, index) => (
			<div key={index} className="flex-1 text-center py-2 border-l">
				<div className="text-sm">{format(day, "EEE")}</div>
			</div>
		))}
	</div>
);

export default CalendarHeader;
