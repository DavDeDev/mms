import { getUserCohorts } from "@/queries/cached-queries";
import { cache } from "react";

export const checkUserAccess = cache(async (cohortId: number) => {
	const cohorts = await getUserCohorts();

	if (!cohorts) {
		return { hasAccess: false, redirect: "/sign-in" };
	}

	const cohort = cohorts.find((c) => c.cohort_id === cohortId);
	if (cohort) {
		return { hasAccess: true, userRole: cohort.user_role };
	}

	return { hasAccess: false, redirect: "/dashboard" };
});
