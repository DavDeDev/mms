import type React from "react";

interface TimeGridProps {
	hours: number[];
}

const TimeGrid: React.FC<TimeGridProps> = ({ hours }) => (
	<div className="h-full flex-1 grid grid-cols-7">
		{Array.from({ length: 7 }).map((_, dayIndex) => (
			<div key={dayIndex} className="border-l ">
				{hours.map((hour) => (
					<div key={hour} className="h-[60px] border-t" />
				))}
			</div>
		))}
	</div>
);

export default TimeGrid;
