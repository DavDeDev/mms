import { getCohorts } from "@/queries";
import { getUserProfile } from "@/queries/cached-queries";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CohortsGrid from "./cohorts-grid";

export default async function CohortsPage() {
	const supabase = createClient();
	const user = await getUserProfile();

	if (!user?.data) {
		return redirect("/sign-in");
	}

	const cohorts = await getCohorts(supabase, user.data.id);

	if (!cohorts) {
		// TODO: if it's admin redirects to create a cohort, if not admin redirects to home
		return redirect("/sign-in");
	}

	// const program = cohorts[0].cohort_coordinator[0].user_profile?.student_id;
	return (
		<div className="flex-1 w-full flex flex-col gap-12">
			<CohortsGrid cohorts={cohorts} />
		</div>
	);
}
