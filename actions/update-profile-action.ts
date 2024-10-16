"use server";

import { updateUser } from "@/mutations";
import { updateUserSchema } from "@/mutations/schema";
import type { ServerActionResponse, Tables } from "@/types";
import { createClient } from "@/utils/supabase/server";
import type { z } from "zod";

export const updateUserAction = async (
	formData: z.infer<typeof updateUserSchema>,
): Promise<ServerActionResponse> => {
	// TODO: add server-side validation
	const { success, error, data } = updateUserSchema.safeParse(formData);
	if (error) {
		return {
			success,
			error: error.message,
		};
	}
	const supabase = createClient();

	// Destructure data for clarity
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

	// Using Partial<Tables<"users">> to indicate a subset of colums
	const mappedData: Partial<Tables<"users">> = {
		first_name: firstName,
		last_name: lastName,
		sex,
		campus,
		school_id: schoolId,
		is_international: isInternational,
		email: email || null,
		bio: bio || null,
		program_of_study: program || null,
		country_of_origin: country || null,
		interests,
		avatar_url: avatarUrl,
	};

	console.log("VATAAAAAR", avatarUrl);

	return updateUser(supabase, mappedData)
		.then(() => {
			return {
				success: true,
			};
		})
		.catch((err) => {
			console.error("Error updating user:", err);
			return {
				success: false,
				error: "Failed to update user. Try again later.",
			};
		});
};
