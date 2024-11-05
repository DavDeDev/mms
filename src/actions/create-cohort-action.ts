"use server";

import { addUserToCohort, createCohort } from "@/mutations";
import { createCohortSchema } from "@/mutations/schema";
import { queryUserByEmail } from "@/queries";
import type { ServerActionResponse } from "@/types";
import { ErrorBase } from "@/utils/ErrorBase";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { z } from "zod";

type ErrorName = "UserInviteError" | "CohortCreationError";

class CohortCreationError extends ErrorBase<ErrorName> {}
/**
 * This action performs the following steps:
 * 1. Create a cohort
 * 2. Add existing users to the cohort
 * 3. Invite non-existing users, then add them to the cohort
 *
 * @param formData
 * @returns
 */
export const createCohortAction = async (
	formData: z.infer<typeof createCohortSchema>,
): Promise<ServerActionResponse> => {
	// Validate form data
	const { success, error, data } = createCohortSchema.safeParse(formData);
	if (!success) {
		return {
			success,
			error: error.message,
		};
	}

	const supabase = await createClient();

	// Create the cohort data object
	const cohortData = {
		avatar_url: data.avatarUrl,
		created_at: new Date().toISOString(),
		end_date: data.dateRange.to.toISOString(),
		semester: data.semester,
		start_date: data.dateRange.from.toISOString(),
		year: data.year,
	};

	try {
		// Create cohort and check for errors
		const { data: cohort, error: createError } = await createCohort(
			supabase,
			cohortData,
		);
		if (createError || !cohort) {
			throw new CohortCreationError({
				name: "CohortCreationError",
				message: `Failed to create cohort: ${createError.message}`,
				cause: createError,
			});
		}

		const cohortId = cohort.id;
		const supabaseAdmin = createAdminClient();

		// Process members in parallel with Promise.all
		await Promise.all(
			data.members.map(async (member) => {
				let userId: string | null = null;

				// Try inviting the user
				const { data: inviteData, error: inviteError } =
					await supabaseAdmin.inviteUserByEmail(member.email, {
						data: { app_role: "user" },
						redirectTo: "/welcome",
					});

				// If user already exists, fetch their ID
				if (inviteError?.code === "email_exists") {
					const { id: existingUserId } = await queryUserByEmail(supabase, {
						email: member.email,
					});
					userId = existingUserId;
				} else if (inviteError) {
					throw new CohortCreationError({
						name: "UserInviteError",
						message: `Failed to invite user to the application: ${inviteError.message}`,
						cause: inviteError,
					});
				} else if (inviteData) {
					// If invitation was successful, store their ID
					userId = inviteData.user.id;
				}

				// Add the user to the cohort if we have a valid user ID
				if (userId) {
					await addUserToCohort(supabase, userId, member.role, cohortId);
				}
			}),
		);

		// Revalidate cache after creating cohort and adding members
		revalidatePath("/dashboard/cohorts");

		return { success: true };
	} catch (error) {
		if (error instanceof CohortCreationError) {
			console.error("Cohort creation error:", error);
			return {
				success: false,
				error: error.message,
			};
		}
		console.error(
			"Unknown error creating cohort or processing members:",
			error,
		);
		return {
			success: false,
			error: "Failed to create cohort. Try again later.",
		};
	}
};
