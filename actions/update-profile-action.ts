"use server";

import { updateUser } from "@/mutations";
import { updateUserSchema } from "@/mutations/schema";
import { Tables } from "@/types";
import { createClient } from '@/utils/supabase/server';
import { z } from "zod";
const supabase = createClient()

export const updateUserAction = async (data: z.infer<typeof updateUserSchema>) => {

  const normalizedInterests = typeof data.interests === 'string'
  ? [data.interests] // convert string to an array with one element
  : data.interests;  
  const mappedData = {
    first_name: data.firstName,
    last_name: data.lastName,
    sex: data.sex, // Assuming sex values match Supabase ("male" | "female" | "other" | null)
    campus: data.campus, // Adjust if necessary for the campus values
    school_id: data.schoolId,
    is_international: data.isInternational,
    email: data.email ?? null, // Handle optional fields with default null
    bio: data.bio ?? null,
    program_of_study: data.program ?? null,
    country_of_origin: data.country ?? null,
    interests: normalizedInterests ?? null,
  };
  updateUser(supabase,mappedData as Tables<'users'>)
}