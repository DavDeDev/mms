import type { Client, Tables } from "@/types";

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
	//TODO: Invalidate next cache

	return supabase
		.from("users")
		.update(data)
		.eq("id", session.user.id)
		.select()
		.single()
		.throwOnError();
}
