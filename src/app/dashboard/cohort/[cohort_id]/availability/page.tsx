import { Button } from "@/components/ui/button";
import WeekCalendar, {
	type CalendarEvent,
} from "@/components/week-calendar/WeekCalendar";
import { getCohortMentorsAvailability } from "@/queries/cached-queries";
import type { Database } from "@/types";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export default async function Page({
	params,
}: { params: Promise<{ cohort_id: number }> }) {
	const { cohort_id } = await params;

	const cohortAvailabilities = await getCohortMentorsAvailability(cohort_id);

	const events: CalendarEvent[] = cohortAvailabilities
		.filter(
			(availability) =>
				availability.day_of_week &&
				availability.start_time &&
				availability.end_time,
		)
		.map((availability) => {
			// Extract necessary data
			const { id, day_of_week, start_time, end_time, cohort_member } =
				availability;

			// Helper function to convert day_of_week into a Date object
			const dayToDate = (
				day: Database["public"]["Enums"]["day_of_week"],
			): Date => {
				// Assume the start of the week is Sunday; customize as needed
				const dayMap: Record<
					Database["public"]["Enums"]["day_of_week"],
					number
				> = {
					sunday: 0,
					monday: 1,
					tuesday: 2,
					wednesday: 3,
					thursday: 4,
					friday: 5,
					saturday: 6,
				};

				// Get the current week's Sunday as the base
				const today = new Date();
				const sunday = new Date(
					today.setDate(today.getDate() - today.getDay()),
				);

				// Calculate the target day of the week
				sunday.setDate(sunday.getDate() + dayMap[day]);
				return sunday;
			};

			// Parse the times
			const startDate = dayToDate(day_of_week!);
			const endDate = new Date(startDate); // Clone the start date for end
			const [startHour, startMinute] = start_time!.split(":").map(Number);
			const [endHour, endMinute] = end_time!.split(":").map(Number);

			startDate.setHours(startHour, startMinute, 0, 0);
			endDate.setHours(endHour, endMinute, 0, 0);

			return {
				id,
				title: `${cohort_member.mentorProfile.first_name} ${cohort_member.mentorProfile.last_name}`,
				start: startDate,
				end: endDate,
				color: "bg-blue-500",
			};
		});

	return (
		<div className="h-full shrink-1 flex flex-col">
			<div className="flex justify-between items-center gap-4">
				<h1 className="text-2xl font-medium">Cohort's Availability</h1>
				<Link href={`/dashboard/cohort/${cohort_id}/availability/add`}>
					<Button className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
						<PlusIcon className="h-4 w-4" />
						Add your availability
					</Button>
				</Link>
			</div>
			<WeekCalendar events={events} />
		</div>
	);
}
