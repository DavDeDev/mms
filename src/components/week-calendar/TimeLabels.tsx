import type React from "react";

interface TimeLabelsProps {
	hours: number[];
}

const TimeLabels: React.FC<TimeLabelsProps> = ({ hours }) => (
	<div className="h-full w-16 shrink-0">
		{hours.map((hour) => (
			<div key={hour} className="h-[60px] relative">
				{hour > 0 && (
					<span className="absolute -top-3 right-2 text-sm">
						{hour === 12
							? "12 PM"
							: hour > 12
								? `${hour - 12} PM`
								: `${hour} AM`}
					</span>
				)}
			</div>
		))}
	</div>
);

export default TimeLabels;
