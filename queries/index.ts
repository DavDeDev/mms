import type { Client } from "../types";

export async function getUserProfileQuery(supabase: Client, userId: string) {
	return supabase
		.from("users")
		.select("*")
		.eq("id", userId)
		.single()
		.throwOnError();
}

export type getUserCohortsParams = {
	userId: string;
};

export async function getUserCohortsQuery(
	supabase: Client,
	params: getUserCohortsParams,
) {
	const { data, error } = await supabase
		.from("cohorts")
		.select(`
      id,
      semester,
      year,
      cohort_members!inner (
        role,
        users!inner (
          id,
          first_name,
          last_name
        )
      )
    `)
		.eq("cohort_members.users.id", params.userId)
		.throwOnError();

	if (error) {
		console.error("Error fetching cohorts:", error);
		throw error;
	}
	const processedData = data.map((cohort) => {
		const cohortCoordinator = cohort.cohort_members.find(
			(cm) => cm.role === "coordinator",
		);
		return {
			cohort_id: cohort.id,
			semester: cohort.semester,
			year: cohort.year,
			mentor_count: cohort.cohort_members.filter((cm) => cm.role === "mentor")
				.length,
			mentee_count: cohort.cohort_members.filter((cm) => cm.role === "mentee")
				.length,
			coordinator_name: cohortCoordinator
				? `${cohortCoordinator.users.first_name} ${cohortCoordinator.users.last_name}`
				: "",
		};
	});

	return processedData;
}
