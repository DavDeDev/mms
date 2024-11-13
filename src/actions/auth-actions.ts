"use server";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getUserCohorts } from "@/queries/cached-queries";
import type { Enums } from "@/types";
import { cache } from "react";

export const signUpAction = async (formData: FormData) => {
	const email = formData.get("email")?.toString();
	const password = formData.get("password")?.toString();
	const firstName = formData.get("firstName")?.toString();
	const lastName = formData.get("lastName")?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get("origin");

	if (!email || !password || !firstName || !lastName) {
		return { error: "Email and password are required" };
	}

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
			data: {
				first_name: firstName,
				last_name: lastName,
			},
		},
	});

	if (error) {
		console.error(`${error.code} ${error.message}`);
		return encodedRedirect("error", "/sign-up", error.message);
	}
	return encodedRedirect(
		"success",
		"/sign-up",
		"Thanks for signing up! Please check your email for a verification link.",
	);
};

export const signInAction = async (formData: FormData) => {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;
	const supabase = await createClient();

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return encodedRedirect("error", "/sign-in", error.message);
	}

	return redirect("/dashboard/cohorts");
};

export const forgotPasswordAction = async (formData: FormData) => {
	const email = formData.get("email")?.toString();
	const supabase = await createClient();
	const origin = (await headers()).get("origin");
	const callbackUrl = formData.get("callbackUrl")?.toString();

	if (!email) {
		return encodedRedirect("error", "/forgot-password", "Email is required");
	}

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		redirectTo: `${origin}/auth/callback?redirect_to=/dashboard/profile/reset-password`,
	});

	if (error) {
		console.error(error.message);
		return encodedRedirect(
			"error",
			"/forgot-password",
			"Could not reset password",
		);
	}

	if (callbackUrl) {
		return redirect(callbackUrl);
	}

	return encodedRedirect(
		"success",
		"/forgot-password",
		"Check your email for a link to reset your password.",
	);
};

export const resetPasswordAction = async (formData: FormData) => {
	const supabase = await createClient();

	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!password || !confirmPassword) {
		encodedRedirect(
			"error",
			"/dashboard/profile/reset-password",
			"Password and confirm password are required",
		);
	}

	if (password !== confirmPassword) {
		encodedRedirect(
			"error",
			"/dashboard/profile/reset-password",
			"Passwords do not match",
		);
	}

	const { error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) {
		encodedRedirect(
			"error",
			"/dashboard/profile/reset-password",
			"Password update failed",
		);
	}

	encodedRedirect(
		"success",
		"/dashboard/profile/reset-password",
		"Password updated",
	);
};

export const signOutAction = async () => {
	const supabase = await createClient();
	await supabase.auth.signOut();
	return redirect("/sign-in");
};

// TODO: refactor this, I don't like it

type AccessCheckResult =
	| {
			hasAccess: true;
			userCohortRole: Enums<"cohort_role">;
	  }
	| {
			hasAccess: false;
			redirectPath: string;
	  };

export const checkUserAccess = cache(
	async (cohortId: number): Promise<AccessCheckResult> => {
		const cohorts = await getUserCohorts();
		// TODO: handle case where user is not enrolled in any cohorts and tries to access dashboard route
		if (!cohorts) {
			return { hasAccess: false, redirectPath: "/cohorts" };
		}

		const cohort = cohorts.find((c) => c.cohort_id === cohortId);

		if (cohort) {
			return { hasAccess: true, userCohortRole: cohort.user_role };
		}

		return { hasAccess: false, redirectPath: "/cohorts" };
	},
);
