"use server";

import { updateUserProfile } from "@/mutations";
import { updateUserSchema } from "@/mutations/schema";
import type { ServerActionResponse, Tables } from "@/types";
import { createClient } from "@/utils/supabase/server";
import type { z } from "zod";

// TODO: never, undefined, or void?
export const updateUserAction = async (
	formData: z.infer<typeof updateUserSchema>,
	// TODO: return the updatedProfile if possible
	// ): Promise<ServerActionResponse<Tables<"users">>> => {
): Promise<ServerActionResponse<never>> => {
	// TODO: add server-side validation
	const { success, error, data } = updateUserSchema.safeParse(formData);
	if (error) {
		return {
			success,
			error: error.message,
		};
	}
	const supabase = createClient();
	// TODO: add preferred name and DOB
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
	// TODO: return the updatedProfile if possible
	await updateUserProfile(supabase, mappedData)
		// .then((data) => {
		// 	return {
		// 		success: true,
		// 		data
		// 	};)
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

	return {
		success: false,
		error: "Failed to update user. Try again later.",
	};
};
