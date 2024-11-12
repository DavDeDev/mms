type MentorAvailability = {
	cohort_mentor_id: number | null;
	day_of_week: string | null;
	end_time: string | null;
	id: number;
	start_time: string | null;
};
export default function TimeSlot({
	availability,
}: { availability: MentorAvailability[] }) {
	return (
		<div
			className="h-20 box-border border-b relative group"
			style={{ boxSizing: "border-box" }}
		>
			<div className="absolute inset-0 hover:bg-muted transition-colors" />

			{availability.length > 0 && (
				<div className="absolute inset-0 m-1 rounded-lg bg-green-500 bg-opacity-90 text-white p-2 cursor-pointer hover:bg-opacity-100 transition-opacity">
					<div className="text-sm font-medium truncate">Available</div>
				</div>
			)}
		</div>
	);
}
