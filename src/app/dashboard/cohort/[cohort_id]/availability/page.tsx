import WeeklyCalendar, {
	type MentorAvailability,
} from "@/components/week-calendar/WeekCalendar";
const sampleAvailability: MentorAvailability[] = [
	{
		id: 1,
		cohort_mentor_id: 1,
		day_of_week: "1", // Monday
		start_time: "10:00",
		end_time: "12:00",
	},
	{
		id: 2,
		cohort_mentor_id: 1,
		day_of_week: "3", // Wednesday
		start_time: "14:00",
		end_time: "16:00",
	},
	{
		id: 3,
		cohort_mentor_id: 1,
		day_of_week: "5", // Friday
		start_time: "09:30",
		end_time: "11:00",
	},
];
export default function Page() {
	return (
		<>
			<h1 className="text-2xl font-semibold mb-4">Mentor Availability</h1>
			<WeeklyCalendar
				mentorAvailability={sampleAvailability}
				config={{
					showDates: false,
					showWeekends: false,
					startHour: 9,
					endHour: 17,
				}}
			/>
		</>
	);
}
