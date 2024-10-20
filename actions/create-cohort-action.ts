"use server";

import { addUserToCohort, createCohort } from "@/mutations";
import { createCohortSchema } from "@/mutations/schema";
import { queryUserByEmail } from "@/queries";
import type { ServerActionResponse } from "@/types";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import type { z } from "zod";

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
): Promise<ServerActionResponse<never>> => {
	// Validate form data
	const { success, error, data } = createCohortSchema.safeParse(formData);
	if (!success) {
		return {
			success: false,
			error: error.message,
		};
	}

	const supabase = createClient();

	// Create the cohort
	const cohortData = {
		avatar_url: data.avatarUrl,
		created_at: new Date().toISOString(),
		end_date: data.dateRange.to.toISOString(),
		semester: data.semester,
		start_date: data.dateRange.from.toISOString(),
		year: data.year,
	};

	let cohortId: number;
	try {
		const { data: cohort, error: createError } = await createCohort(
			supabase,
			cohortData,
		);
		if (createError) throw createError;
		cohortId = cohort.id;
	} catch (createError) {
		console.error("Error creating cohort", createError);
		return {
			success: false,
			error: createError as string,
		};
	}

	const supabaseAdmin = createAdminClient();

	// Iterate over the members and handle existing or new users
	for (const member of data.members) {
		try {
			let userId: string | null = null;

			// Try to invite the user
			const { data: inviteData, error: inviteError } =
				await supabaseAdmin.inviteUserByEmail(member.email, {
					redirectTo: "/welcome",
				});

			if (inviteError && inviteError.code === "email_exists") {
				console.log(`User ${member.email} already exists. Fetching user id.`);
				// If the user already exists, fetch their user id
				const { id: existingUserId } = await queryUserByEmail(
					supabase,
					member.email,
				);
				userId = existingUserId;
			} else if (inviteData) {
				console.log(`Invitation sent to ${member.email}, fetching user id.`);
				// After successful invitation, get the user's id from the response
				const { id: invitedUserId } = await queryUserByEmail(
					supabase,
					member.email,
				);
				userId = invitedUserId;
			}
			if (userId) {
				// Add the user to the cohort
				await addUserToCohort(supabase, userId, member.role, cohortId);
			}
		} catch (err) {
			console.error(`Error processing user ${member.email}:`, err);
			return {
				success: false,
				error: `Failed to invite/add user ${member.email}: ${err}`,
			};
		}
	}
	// Revalidate cache
	// revalidateTag(`cohort_${cohortId}`);
	revalidatePath("/cohorts");

	return {
		success: true,
	};
};
