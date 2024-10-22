import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
	// Create an unmodified response
	let response = await NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				async getAll() {
					await request.cookies.getAll();
					return await request.cookies.getAll();
				},
				async setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value),
					);
					response = NextResponse.next({
						request,
					});
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options),
					);
				},
			},
		},
	);

	// This will refresh session if expired - required for Server Components
	// https://supabase.com/docs/guides/auth/server-side/nextjs
	const user = await supabase.auth.getUser();

	// protected routes
	if (request.nextUrl.pathname.startsWith("/cohorts") && user.error) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	// if (request.nextUrl.pathname === "/" && !user.error) {
	// 	return NextResponse.redirect(new URL("/cohorts", request.url));
	// }

	return response;
};
