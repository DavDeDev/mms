"use server";

import { updateUser } from "@/mutations";
import type { updateUserSchema } from "@/mutations/schema";
import type { Tables } from "@/types";
import { createClient } from "@/utils/supabase/server";
import type { z } from "zod";
const supabase = createClient();

export const updateUserAction = async (
	data: z.infer<typeof updateUserSchema>,
) => {
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
	} = data;

	// Ensure interests is always an arr

	// Using Partial<Tables<"users">> to indicate a subset of colums
	const mappedData: Partial<Tables<"users">> = {
		first_name: firstName,
		last_name: lastName,
		sex, // Assuming Supabase expects ("male" | "female" | "other" | null)
		campus,
		school_id: schoolId,
		is_international: isInternational,
		email: email || null, // Use fallback for optional fields
		bio: bio || null,
		program_of_study: program || null,
		country_of_origin: country || null,
		interests,
	};

	// Call update function with mapped data
	updateUser(supabase, mappedData);
};
