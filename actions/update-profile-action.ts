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
	// var currentTime = new Date().getTime();

	// while (currentTime + 1000 >= new Date().getTime()) {}

	// throw error;
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
	};
	// Call update function with mapped data
	return updateUser(supabase, mappedData);
};
