import EnhancedMentorCard from "@/components/mentor-matching-card";
import type { getCohortMentors } from "@/queries/cached-queries";

export default async function MentorCohortGrid({
	cohort_id,
}: { cohort_id: number }) {
	// const mentors = await getCohortMentors(cohort_id);
	const dummyMentors: Awaited<ReturnType<Awaited<typeof getCohortMentors>>> = [
		{
			mentorProfile: {
				avatar_url: "https://example.com/avatar1.jpg",
				bio: "Experienced software engineer with a passion for teaching.",
				campus: "Progress",
				country_of_origin: "Canada",
				created_at: "2023-01-01T00:00:00Z",
				email: "mentor1@example.com",
				first_name: "John",
				id: "1",
				interests: ["coding", "teaching"],
				is_international: false,
				last_name: "Doe",
				phone_number: "123-456-7890",
				program_of_study: "Computer Science",
				role: "user",
				school_id: 1,
				sex: "male",
			},
			mentorAvailability: [
				{
					cohort_mentor_id: 1,
					day_of_week: "monday",
					end_time: "17:00",
					id: 1,
					start_time: "09:00",
				},
			],
		},
		{
			mentorProfile: {
				avatar_url: "https://example.com/avatar2.jpg",
				bio: "Data scientist with a love for data visualization.",
				campus: "Morningside",
				country_of_origin: "USA",
				created_at: "2023-02-01T00:00:00Z",
				email: "mentor2@example.com",
				first_name: "Jane",
				id: "2",
				interests: ["data science", "visualization"],
				is_international: true,
				last_name: "Smith",
				phone_number: "987-654-3210",
				program_of_study: "Data Science",
				role: "user",
				school_id: 2,
				sex: "female",
			},
			mentorAvailability: [
				{
					cohort_mentor_id: 2,
					day_of_week: "tuesday",
					end_time: "18:00",
					id: 2,
					start_time: "10:00",
				},
			],
		},
	];
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{dummyMentors.map((mentor) => (
				<EnhancedMentorCard mentor={mentor} key={mentor.mentorProfile.id} />
			))}
		</div>
	);
}
