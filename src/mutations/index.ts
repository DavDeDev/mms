import type { Client, Enums, Tables } from "@/types";
import { revalidateTag } from "next/cache";

export async function updateUserProfile(
	supabase: Client,
	data: Partial<Tables<"users">>,
): Promise<Tables<"users">> {
	// Get the user session
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		throw new Error("User not authenticated");
	}

	// Update the user profile in the database
	const { error, data: updatedUser } = await supabase
		.from("users")
		.update(data)
		.eq("id", session.user.id)
		.select("*")
		.single()
		.throwOnError(); // This will throw if there's an error

	// Although the error is thrown by .thrownOnError(), it doesn't Type Check the returned Data, so we need to check it manually. READ: https://github.com/supabase/postgrest-js/issues/563
	if (error) {
		throw error;
	}

	// Revalidate cache if user is updated
	revalidateTag(`user_profile_${session.user.id}`);

	return updatedUser;
}

export async function createCohort(
	supabase: Client,
	data: Omit<Tables<"cohorts">, "id">,
) {
	return await supabase.from("cohorts").insert([data]).select("id").single();
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

/**
 * Add mentor availability
 */
export async function addMentorAvailability(
	supabase: Client,
	data: Omit<Tables<"mentor_availability">, "id">,
) {
	return await supabase
		.from("mentor_availability")
		.insert([data])
		.throwOnError();
}
