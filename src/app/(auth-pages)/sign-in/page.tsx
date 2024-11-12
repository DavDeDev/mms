"use clientg";
import { signInAction } from "@/actions/auth-actions"; // Adjust the import based on your file structure
import { SeparatorWithText } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import { FormMessage, type Message } from "components/form-message";
import { SubmitButton } from "components/submit-button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import Link from "next/link";
import OneTapComponent from "./OneTapGoogle";
import SignInWithGoogle from "./SignInWithGoogle";

export default async function SignIn(props: {
	searchParams: Promise<Message>;
}) {
	const searchParams = await props.searchParams;
	// const returnTo = searchParams.get("return_to");
	const supabase = await createClient();
	const returnTo = "https://example.com";
	// const handleGoogleSignIn = async () => {
	// 	const redirectTo = new URL("/api/auth/callback", window.location.origin);

	// 	if (returnTo) {
	// 		redirectTo.searchParams.append("return_to", returnTo);
	// 	}

	// 	redirectTo.searchParams.append("provider", "google");

	// 	await supabase.auth.signInWithOAuth({
	// 		provider: "google",
	// 		options: {
	// 			redirectTo: redirectTo.toString(),
	// 		},
	// 	});
	// }

	if ("message" in searchParams) {
		return (
			<div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
				<FormMessage message={searchParams} />
			</div>
		);
	}
	return (
		<form className="flex flex-col w-64 mx-auto">
			<h1 className="text-2xl font-medium">Sign in</h1>
			<p className="text-sm text text-foreground">
				Don't have an account?{" "}
				<Link className="text-primary font-medium underline" href="/sign-up">
					Sign up
				</Link>
			</p>
			<div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
				<Label htmlFor="email">Email</Label>
				<Input
					name="email"
					placeholder="you@example.com"
					type="email"
					required
				/>
				<div className="flex justify-between items-center">
					<Label htmlFor="password">Password</Label>
					<Link
						className="text-xs text-foreground underline"
						href="/forgot-password"
					>
						Forgot Password?
					</Link>
				</div>
				<Input
					type="password"
					name="password"
					placeholder="Your password"
					minLength={6}
					required
				/>
				<SubmitButton formAction={signInAction} pendingText="Signing in...">
					Sign in
				</SubmitButton>
				<SeparatorWithText text="or" />
				<SignInWithGoogle />
				<OneTapComponent />
				<FormMessage message={searchParams} />
			</div>
		</form>
	);
}
