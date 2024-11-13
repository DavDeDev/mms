import MentorAvailabilityForm from "@/components/forms/add-mentor-availability";

export default async function Page({
	params,
}: { params: Promise<{ cohort_id: number }> }) {
	const { cohort_id } = await params;
	return (
		<div className="container">
			<MentorAvailabilityForm cohortId={cohort_id} />
		</div>
	);
}
