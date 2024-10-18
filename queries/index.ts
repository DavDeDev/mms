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
			start_date,
			end_date,
      year,
			avatar_url,
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
			start_date: cohort.start_date,
			end_date: cohort.end_date,
			year: cohort.year,
			avatar_url: cohort.avatar_url,
			mentor_count: cohort.cohort_members.filter((cm) => cm.role === "mentor")
				.length,
			mentee_count: cohort.cohort_members.filter((cm) => cm.role === "mentee")
				.length,
			coordinator_name: cohortCoordinator
				? `${cohortCoordinator.users.first_name} ${cohortCoordinator.users.last_name}`
				: null,
		};
	});

	return processedData;
}
