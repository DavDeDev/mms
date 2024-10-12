import { signInAction } from "@/actions/auth-actions"; // Adjust the import based on your file structure
import { FormMessage, type Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignIn({ searchParams }: { searchParams: Message }) {
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
				<FormMessage message={searchParams} />
			</div>
		</form>
	);
}
