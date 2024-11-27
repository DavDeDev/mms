import { getUserCohortRole } from "@/queries/cached-queries";
import { redirect } from "next/navigation";
import MentorCohortGrid from "./mentor-card-grid";

export default async function Page({
	params,
}: {
	params: Promise<{ cohort_id: number }>;
}) {
	const cohort_id = (await params).cohort_id;
	const { cohortRole } = await getUserCohortRole(cohort_id);

	if (cohortRole === "mentor") {
		return redirect(`/dashboard/cohort/${cohort_id}`);
	}

	return <MentorCohortGrid cohort_id={cohort_id} />;
}
