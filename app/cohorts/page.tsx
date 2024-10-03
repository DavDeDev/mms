import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import CohortsGrid from "./cohorts-grid";
import { getSession, getUser } from "@/queries/cached-queries";
import { getCohorts } from "@/queries";

export default async function CohortsPage() {
	const supabase = createClient();
  const user = await getUser();

	console.log("USER", user)

	const cohorts = await getCohorts(supabase, user?.data?.user_id);
	console.log(cohorts)
	console.log("COHORTS", cohorts)



	if (!user) {
		return redirect("/sign-in");
	}

	return (
		<div className="flex-1 w-full flex flex-col gap-12">
			<CohortsGrid />
		</div>
	);
}
