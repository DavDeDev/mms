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
