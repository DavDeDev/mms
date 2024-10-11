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
	console.log(data);
	return supabase
		.from("users")
		.update(data)
		.eq("id", session.user.id)
		.select()
		.single()
		.throwOnError();

	// id: user?.id as string,
	// full_name: fullname,
	// username,
	// website,
	// avatar_url,
	// updated_at: new Date().toISOString(),
}
