import "server-only";

import { createClient } from "@/utils/supabase/server";
import { unstable_cache } from "next/cache";
import { getUserQuery } from "../queries";
import { Client } from "@/types";



export const getSession = unstable_cache(
  async (supabase: Client) => {
    return supabase.auth.getSession();
  },
  ["session"],
  {
    tags: ["session"],
    revalidate: 3600, // Cache for 1 hour
  }
);

// FIXME: Investigate cache implementation
// export const getSession = cache(async () => {
//   const supabase = createClient();

//   return supabase.auth.getSession();
// });


export const getUser = async () => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id;

  if (!userId) {
    return null;
  }

  return unstable_cache(
    async () => {
      return getUserQuery(supabase, userId);
    },
    ["user", userId],
    {
      tags: [`user_${userId}`],
      revalidate: 180,
    },
  )(userId);
};

