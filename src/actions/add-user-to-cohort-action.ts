"use server";

import { addUserToCohort } from "@/mutations";
import { queryUserByEmail } from "@/queries";
import type { CohortRole } from "@/types/enums";
import { ErrorBase } from "@/utils/ErrorBase";
import { createAdminClient, createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";

type ErrorName = "UserInviteError";

class AddUserToCohortError extends ErrorBase<ErrorName> {}

export async function inviteUserToCohort(cohortId: number, formData: FormData) {
	const email = formData.get("email") as string;
	const role = formData.get("role") as CohortRole;

	const supabase = await createClient();
	const supabaseAdmin = createAdminClient();

	let userId: string | null = null;

	try {
		// Try inviting the user
		const { data: inviteData, error: inviteError } =
			await supabaseAdmin.inviteUserByEmail(email, {
				data: { app_role: "user" },
				redirectTo: "/welcome",
			});

		// If user already exists, fetch their ID
		if (inviteError?.status === 400 || inviteError?.code === "email_exists") {
			const { id: existingUserId } = await queryUserByEmail(supabase, {
				email,
			});
			userId = existingUserId;
		} else if (inviteError) {
			throw new AddUserToCohortError({
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
			await addUserToCohort(supabase, userId, role, cohortId);
			revalidateTag(`cohort_members_${cohortId}`);
			return {
				success: true,
				message: "User invited and added to cohort successfully.",
			};
		} else {
			throw new Error("Failed to get user ID");
		}
	} catch (error) {
		console.error("Error inviting user to cohort:", error);
		return { success: false, message: "Failed to invite user to cohort." };
	}
}
