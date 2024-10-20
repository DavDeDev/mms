import type { Client, Enums, Tables } from "@/types";
import { revalidateTag } from "next/cache";

export async function updateUserProfile(
	supabase: Client,
	// TODO investigate: Table<"users"> should already consider nullable Columns so there should be no need for Partial<>
	data: Partial<Tables<"users">>,
) {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		return;
	}

	// This doesn't return anything
	// use data as result

	const { error, data: updatedUser } = await supabase
		.from("users")
		.update(data)
		.eq("id", session.user.id)
		.select("*")
		.single()
		.throwOnError();
	// .then(() => revalidateTag(`user_profile_${session.user.id}`));
	if (error) {
		throw error;
	}
	// revalidate cache
	if (updatedUser) {
		revalidateTag(`user_profile_${session.user.id}`);
	}
	return updatedUser;
}

export async function createCohort(
	supabase: Client,
	data: Omit<Tables<"cohorts">, "id">,
) {
	console.log("data inside mutation: ", data);
	return await supabase
		.from("cohorts")
		.insert([data])
		.select("id")
		.single()
		.throwOnError();
}

export async function addUserToCohort(
	supabase: Client,
	userId: string,
	role: Enums<"cohort_role">,
	cohortId: number,
) {
	return await supabase
		.from("cohort_members")
		.insert([{ user_id: userId, role, cohort_id: cohortId }])
		.throwOnError();
}
