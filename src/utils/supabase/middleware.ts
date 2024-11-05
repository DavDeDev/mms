import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
	// Create an unmodified response
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	});

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
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
	// This will refresh session if expired - required for Server Components
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// protected routes
	if (request.nextUrl.pathname.startsWith("/cohorts") && !user) {
		return NextResponse.redirect(new URL("/sign-in", request.url));
	}

	// Check for dashboard access
	if (request.nextUrl.pathname.startsWith("/dashboard/")) {
		if (!user) {
			return NextResponse.redirect(new URL("/sign-in", request.url));
		}
		if (request.nextUrl.pathname.split("/")[2] === "cohort") {
			// Check if the cohortId is a number
			const cohortId = request.nextUrl.pathname.split("/")[3];
			if (!cohortId || isNaN(Number.parseInt(cohortId))) {
				return NextResponse.redirect(new URL("/cohorts", request.url));
			}
		}

		// Set a custom header to indicate that the middleware check has passed
		response.headers.set("x-middleware-cache", "no-cache");
	}

	return response;
};
