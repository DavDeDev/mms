import { format } from "date-fns";
import type React from "react";
import { CalendarEvent } from "./WeekCalendar";


export interface TimePosition {
	top: string;
	height: string;
	left: string;
	width: string;
}
interface EventLayerProps {
	events: CalendarEvent[];
	getEventPosition: (event: CalendarEvent) => TimePosition;
}

const EventLayer: React.FC<EventLayerProps> = ({
	events,
	getEventPosition,
}) => (
	<div className="absolute inset-0 pointer-events-none">
		<div className="ml-16 relative h-full">
			{events.map((event) => (
				<div
					key={event.id}
					className={`absolute ${event.color} p-2 rounded opacity-90 overflow-hidden`}
					style={getEventPosition(event)}
				>
					<div className="text-sm font-semibold">{event.title}</div>
					<div className="text-xs">
						{format(event.start, "h:mm a")} - {format(event.end, "h:mm a")}
					</div>
				</div>
			))}
		</div>
	</div>
);

export default EventLayer;
