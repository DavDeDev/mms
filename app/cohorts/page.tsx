import { CohortCard } from "@/components/cohort-card";
import { getUserCohorts, getUserProfile } from "@/queries/cached-queries";
import { redirect } from "next/navigation";

export default async function CohortsPage() {
	const user = await getUserProfile();

	if (!user?.data) {
		return redirect("/sign-in");
	}
	const cohorts = await getUserCohorts();

	if (!cohorts) {
		// TODO: if it's admin redirects to create a cohort, if not admin redirects to home
		return redirect("/sign-in");
	}

	// const program = cohorts[0].cohort_coordinator[0].user_profile?.student_id;
	return (
		<div className="flex-1 w-full flex flex-col gap-12">
			{/* <CohortsGrid cohorts={cohorts} /> */}
			<CohortCard cohort={cohorts[0]} />
		</div>
	);
}
