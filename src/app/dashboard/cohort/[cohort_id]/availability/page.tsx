import WeeklyCalendar from "@/components/week-calendar/WeekCalendar";
import { getCohortMentorsAvailability } from "@/queries/cached-queries";

export default async function Page({
	params,
}: { params: Promise<{ cohort_id: number }> }) {
	const { cohort_id } = await params;

	const cohortAvailabilities = await getCohortMentorsAvailability(cohort_id);
	return (
		<>
			<h1 className="text-2xl font-semibold mb-4">Mentor Availability</h1>
			<WeeklyCalendar
				mentorAvailability={cohortAvailabilities}
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
