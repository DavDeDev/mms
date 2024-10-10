import type { Client } from "../types";

export async function getUserProfileQuery(supabase: Client, userId: string) {
	console.log("💩Cache expired, retrieving user")
	return supabase
		.from("users")
		.select("*")
		.eq("id", userId)
		.single()
		.throwOnError();
}

export async function getCohorts(supabase: Client, userId: string) {
	const { data } = await supabase
		.from("cohorts")
		.select(`
      *,
      cohort_members (
        *,
        users (
          *
        )
      )
    `)
		// .eq("cohort_member.users.user_id", userId)
		// .returns<Tables<'cohort'>[]>()
		.throwOnError();

	return data;
}
