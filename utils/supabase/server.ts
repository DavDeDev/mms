import type { Database } from "@/types";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAuthClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import "server-only";

export const createClient = () => {
	const cookieStore = cookies();

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch (error) {
						// The `set` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		},
	);
};

/**
 * Setting up Server-Side Auth Admin for Next.js
 *
 * @link https://supabase.com/docs/reference/javascript/admin-api
 */
export function createAdminClient() {
	console.log("Creating admin client");
	const supabase = createAuthClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		},
	);

	// Access auth admin api
	const adminAuthClient = supabase.auth.admin;

	return adminAuthClient;
}
