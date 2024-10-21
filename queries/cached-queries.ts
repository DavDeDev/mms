import "server-only";

import type { Client } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { getUserCohortsQuery, getUserProfileQuery } from "../queries";

export const getSession = unstable_cache(
	async (supabase: Client) => {
		return supabase.auth.getSession();
	},
	["session"],
	{
		tags: ["session"],
		revalidate: 3600, // Cache for 1 hour
	},
);

// FIXME: Investigate cache implementation
// export const getSession = cache(async () => {
//   const supabase = createClient();

//   return supabase.auth.getSession();
// });

export const getUserProfile = async () => {
	const supabase = createClient();
	const {
		data: { session },
	} = await getSession(supabase);
	const userId = session?.user?.id;

	// if the session doesn't have a user Id it redirects to login page
	if (!userId) {
		redirect("/sign-in");
	}

	return unstable_cache(
		async () => {
			return getUserProfileQuery(supabase, userId);
		},
		["user_profile", userId],
		{
			tags: [`user_profile_${userId}`],
			revalidate: 3600,
		},
	)();
};

export const getUserCohorts = async () => {
	const supabase = createClient();
	const { data } = await getUserProfile();

	if (!data) {
		return null;
	}

	return unstable_cache(
		async () => {
			return getUserCohortsQuery(supabase, {
				userId: data.id,
			});
		},
		["cohorts", "user", data.id],
		{
			tags: [`cohorts_user_${data.id}`],
			revalidate: 3600,
		},
	)();
};
