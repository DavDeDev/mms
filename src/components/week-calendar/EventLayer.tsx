import { format } from "date-fns";
import type React from "react";
import type { CalendarEvent } from "./WeekCalendar";

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

const calculateEventOverlaps = (events: CalendarEvent[]) => {
	// Group events by day
	const eventsByDay: { [key: number]: CalendarEvent[] } = {};
	events.forEach((event) => {
		const day = event.start.getDay();
		if (!eventsByDay[day]) {
			eventsByDay[day] = [];
		}
		eventsByDay[day].push(event);
	});

	// Calculate overlaps for each day
	const eventPositions: { [eventId: number]: { width: string; left: string } } =
		{};

	Object.keys(eventsByDay).forEach((day) => {
		const dayEvents = eventsByDay[Number.parseInt(day)];

		// Sort events by start time
		dayEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

		// Detect and handle overlaps
		const overlappingGroups: CalendarEvent[][] = [];
		dayEvents.forEach((event) => {
			// Find an existing group where this event overlaps
			const existingGroup = overlappingGroups.find((group) =>
				group.some(
					(groupEvent) =>
						event.start < groupEvent.end && event.end > groupEvent.start,
				),
			);

			if (existingGroup) {
				existingGroup.push(event);
			} else {
				overlappingGroups.push([event]);
			}
		});

		// Calculate positioning for each group of overlapping events
		overlappingGroups.forEach((group) => {
			const groupWidth = 100 / group.length;

			group.forEach((event, index) => {
				eventPositions[event.id] = {
					width: `${groupWidth}%`,
					left: `${(100 / 7) * event.start.getDay() + index * groupWidth}%`,
				};
			});
		});
	});

	return eventPositions;
};

const EventLayer: React.FC<EventLayerProps> = ({
	events,
	getEventPosition,
}) => {
	const eventOverlaps = calculateEventOverlaps(events);

	return (
		<div className="absolute inset-0 pointer-events-none">
			<div className="grid grid-cols-7 h-full">
				{Array.from({ length: 7 }).map((_, dayIndex) => (
					<div key={dayIndex} className="relative">
						{events
							.filter((event) => event.start.getDay() === dayIndex)
							.map((event) => {
								const basePosition = getEventPosition(event);
								const overlapPosition = eventOverlaps[event.id];

								return (
									<div
										key={event.id}
										className={`absolute ${event.color} p-1 rounded opacity-90 overflow-hidden`}
										style={{
											...basePosition,
											width: overlapPosition.width,
											left: overlapPosition.left,
											zIndex: 10,
										}}
									>
										<div className="text-xs font-semibold truncate">
											{event.title}
										</div>
										<div className="text-[0.6rem] truncate">
											{format(event.start, "h:mm a")} -{" "}
											{format(event.end, "h:mm a")}
										</div>
									</div>
								);
							})}
					</div>
				))}
			</div>
		</div>
	);
};

export default EventLayer;
