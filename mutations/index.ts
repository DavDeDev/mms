import type { Client, Tables } from "@/types";
import { revalidateTag } from "next/cache";

export async function updateUser(
	supabase: Client,
	data: Partial<Tables<"users">>,
) {
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		return;
	}

	// This doesn't return anything
	return await supabase
		.from("users")
		.update(data)
		.eq("id", session.user.id)
		.select()
		.single()
		.throwOnError()
		.then(() => revalidateTag(`user_profile_${session.user.id}`));
}
