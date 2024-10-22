import type { Database } from "@/types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import "server-only";
import { createClient as createAuthClient } from "@supabase/supabase-js";

export const createClient = async () => {
	// Access cookies for session management
	const cookieStore = await cookies(); // no need for 'await' here

	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					// Get all cookies as an array
					return cookieStore.getAll();
				},
				setAll(cookiesToSet) {
					try {
						// Set cookies one by one
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options);
						});
					} catch (error) {
						// Handle this gracefully in server-only environments
						console.warn("Cookies cannot be set from a Server Component.");
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
