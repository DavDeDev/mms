import "server-only";

import type { Client } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import { getUserProfileQuery } from "../queries";

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
		data: { user },
	} = await supabase.auth.getUser();
	const userId = user?.id;

	if (!userId) {
		return null;
	}

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
