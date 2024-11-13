import type { getCohortMentorsAvailability } from "@/queries/cached-queries";

type TimeSlotProps = {
	availabilities: Awaited<ReturnType<typeof getCohortMentorsAvailability>>;
};

export const TimeSlot: React.FC<TimeSlotProps> = ({ availabilities }) => {
	const mentorNames = availabilities.map(
		(avail) =>
			`${avail.cohort_member.mentorProfile.first_name} ${avail.cohort_member.mentorProfile.last_name}`,
	);

	return (
		<div
			className="h-20 box-border border-b relative group"
			style={{ boxSizing: "border-box" }}
		>
			<div className="absolute inset-0 hover:bg-muted transition-colors" />

			{availabilities.length > 0 && (
				<div className="absolute inset-0 m-1 rounded-lg bg-green-500 bg-opacity-90 text-white p-2 cursor-pointer hover:bg-opacity-100 transition-opacity">
					<div className="text-sm font-medium truncate">
						{mentorNames.join(", ")}
					</div>
					<div className="text-xs">Available</div>
				</div>
			)}
		</div>
	);
};
