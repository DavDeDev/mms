import EnhancedMentorCard from "@/components/mentor-matching-card";
import { getCohortMentors } from "@/queries/cached-queries";

export default async function MentorCohortGrid({
	cohort_id,
}: { cohort_id: number }) {
	const mentors = await getCohortMentors(cohort_id);

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{mentors.map((mentor) => (
				<EnhancedMentorCard mentor={mentor} key={mentor.mentorProfile.id} />
			))}
		</div>
	);
}
