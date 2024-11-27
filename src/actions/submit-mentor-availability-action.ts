"use server";
import { addMentorAvailability } from "@/mutations";
import { createMentorAvailabilitySchema } from "@/mutations/schema";
import {
	getCohortMemberQuery,
	getCohortMentorAvailabilityQuery,
} from "@/queries";
import { getUserId } from "@/queries/cached-queries";
import type { ServerActionResponse } from "@/types";
import { ErrorBase } from "@/utils/ErrorBase";
import { createClient } from "@/utils/supabase/server";
import { revalidateTag } from "next/cache";
import type { z } from "zod";

type ErrorName =
	| "NotAMentorError"
	| "AvailabilityCreationError"
	| "AlreadyExistsError";

class AvailabilitySubmissionError extends ErrorBase<ErrorName> {}

export const submitMentorAvailabilityAction = async (
	formData: z.infer<typeof createMentorAvailabilitySchema>,
	cohortId: number,
): Promise<ServerActionResponse> => {
	console.log("starting action!!1");
	// Validate form data
	const { success, error, data } =
		createMentorAvailabilitySchema.safeParse(formData);
	if (!success) {
		return {
			success: false,
			error: error.message,
		};
	}

	// Validate cohortId type
	const parsedCohortId = Number(cohortId);
	if (Number.isNaN(parsedCohortId)) {
		return {
			success: false,
			error: "Invalid cohort id",
		};
	}

	try {
		const supabase = await createClient();
		const userId = await getUserId();

		// Check if the user has already submitted availability for the cohort
		const mentorAvailability = await getCohortMentorAvailabilityQuery(
			supabase,
			cohortId,
			userId,
		);

		if (mentorAvailability) {
			throw new AvailabilitySubmissionError({
				name: "AlreadyExistsError",
				message: "User has already submitted availability for the cohort",
			});
		}

		// Retrieve the user's cohort membership information
		const memberInCohort = await getCohortMemberQuery(
			supabase,
			cohortId,
			userId,
		);

		// Ensure the user has a mentor role in the cohort
		if (memberInCohort.role !== "mentor") {
			throw new AvailabilitySubmissionError({
				name: "NotAMentorError",
				message: "User is not a mentor in the cohort",
			});
		}

		const mappedData = {
			cohort_mentor_id: memberInCohort.id,
			start_time: data.startTime,
			end_time: data.endTime,
			day_of_week: data.dayOfWeek,
		};

		// Attempt to add mentor availability in the database
		const { data: availabilityData, error: availabilityError } =
			await addMentorAvailability(supabase, mappedData);

		if (availabilityError) {
			throw new AvailabilitySubmissionError({
				name: "AvailabilityCreationError",
				message: `Failed to create availability entry: ${availabilityError.message}`,
				cause: availabilityError,
			});
		}
		// Invalidate cached mentor availability data
		revalidateTag(`cohort_mentor_availability_${cohortId}`);

		return { success: true, data: availabilityData ?? null };
	} catch (error) {
		if (error instanceof AvailabilitySubmissionError) {
			return {
				success: false,
				error: error.message,
			};
		}
		// Generic error handling
		return {
			success: false,
			error: `Failed to submit mentor availability: ${error}`,
		};
	}
};
