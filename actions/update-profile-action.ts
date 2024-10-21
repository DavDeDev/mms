"use server";

import { updateUserProfile } from "@/mutations";
import { updateUserSchema } from "@/mutations/schema";
import type { ServerActionResponse, Tables } from "@/types";
import { createClient } from "@/utils/supabase/server";
import type { z } from "zod";

export const updateUserAction = async (
	formData: z.infer<typeof updateUserSchema>,
): Promise<ServerActionResponse<{ id: string }>> => {
	// Validate formData using safeParse
	const { success, error, data } = updateUserSchema.safeParse(formData);
	if (!success) {
		return {
			success,
			error: error.message,
		};
	}

	const supabase = createClient();

	// Map form data to match the database schema
	const {
		firstName,
		lastName,
		sex,
		campus,
		schoolId,
		isInternational,
		email,
		bio,
		program,
		country,
		interests,
		avatarUrl,
	} = data;

	const mappedData: Partial<Tables<"users">> = {
		first_name: firstName,
		last_name: lastName,
		sex,
		campus,
		school_id: schoolId,
		is_international: isInternational,
		email: email || null,
		bio: bio || null,
		program_of_study: program,
		country_of_origin: country || null,
		interests,
		avatar_url: avatarUrl || null,
	};

	try {
		// Attempt to update user profile
		const updatedProfile = await updateUserProfile(supabase, mappedData);

		return {
			success: true,
			data: { id: updatedProfile.id },
		};
	} catch (error) {
		console.error("Error updating user:", error);
		return {
			success: false,
			error: "Failed to update user. Try again later.",
		};
	}
};
