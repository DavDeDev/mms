import type { Enums } from "@/types";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
	type: "error" | "success",
	path: string,
	message: string,
) {
	return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

/**
 * DON'T USE IT IN PRODUCTION JUST FOR TESTING
 * @param miliseconds
 */
export function artificialDelay(miliseconds: number) {
	const currentTime = new Date().getTime();

	while (currentTime + miliseconds >= new Date().getTime()) {}
}

type CohortRole = Enums<"cohort_role">;

export const getCohortRoleColors = (role: CohortRole) => {
	switch (role) {
		case "admin":
			return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-red-300 dark:border-red-700";
		case "mentor":
			return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-blue-300 dark:border-blue-700";
		case "mentee":
			return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-green-300 dark:border-green-700";
		case "coordinator":
			return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700";
		default:
			return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-600";
	}
};
