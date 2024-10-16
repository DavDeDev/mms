import { getUserCohorts, getUserProfile } from "@/queries/cached-queries";
import { redirect } from "next/navigation";
import { CohortDisplay } from "./cohorts-grid";

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

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-6">Cohorts</h1>
			<CohortDisplay cohorts={cohorts} userRole={user.data.role} />
		</div>
	);
}
