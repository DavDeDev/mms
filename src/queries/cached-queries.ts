import "server-only";
import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";
import { getUserCohortsQuery, getUserProfileQuery } from "../queries";

// FIXME: Investigate cache implementation
export const getSession = cache(async () => {
	const supabase = await createClient();

	return supabase.auth.getSession();
});

export const getUserProfile = async () => {
	const {
		data: { session },
	} = await getSession();
	const userId = session?.user?.id;

	// if the session doesn't have a user Id it redirects to login page
	if (!userId) {
		redirect("/sign-in");
	}

	const supabase = await createClient();
	return unstable_cache(
		async () => {
			return getUserProfileQuery(supabase, userId);
		},
		["user_profile", userId],
		{
			tags: [`user_profile_${userId}`],
			revalidate: 3,
		},
	)();
};

export const getUserCohorts = async () => {
	const {
		data: { session },
	} = await getSession();
	const userId = session?.user?.id;

	// if the session doesn't have a user Id it redirects to login page
	if (!userId) {
		redirect("/sign-in");
	}

	const supabase = await createClient();
	return unstable_cache(
		async () => {
			return getUserCohortsQuery(supabase, {
				userId: userId,
			});
		},
		["cohorts", "user", userId],
		{
			tags: [`cohorts_user_${userId}`],
			revalidate: 3600,
		},
	)();
};
