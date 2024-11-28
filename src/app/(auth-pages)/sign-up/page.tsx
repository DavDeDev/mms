import { signUpAction } from "@/actions/auth-actions";
import { FormMessage, type Message } from "components/form-message";
import { SubmitButton } from "components/submit-button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
    searchParams: Promise<Message>;
}) {
    const searchParams = await props.searchParams;

    // Check for a message in searchParams
    if ("message" in searchParams) {
        return (
            <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                <FormMessage message={searchParams} />
            </div>
        );
    }

    return (
        <form className="flex flex-col w-64 mx-auto">
            <h1 className="text-2xl font-medium">Sign up</h1>
            <p className="text-sm text text-foreground">
                Already have an account?{" "}
                <Link
                    className="text-primary font-medium underline"
                    href="/sign-in"
                >
                    Sign in
                </Link>
            </p>
            <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                    name="firstName"
                    placeholder="Your first name"
                    required
                />

                <Label htmlFor="lastName">Last Name</Label>
                <Input
                    name="lastName"
                    placeholder="Your last name"
                    required
                />

                <Label htmlFor="email">Email</Label>
                <Input
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    required
                />

                <Label htmlFor="password">Password</Label>
                <Input
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                />

                {/* Submit Button */}
                <SubmitButton formAction={async (formData) => {
                    try {
                        await signUpAction(formData);
                    } catch (error) {
                        console.error("Error during sign up:", error);
                        throw new Error("Sign up failed. Please try again.");
                    }
                }} pendingText="Signing up...">
                    Sign up
                </SubmitButton>

                {/* Display Form Messages */}
                <FormMessage message={searchParams} />
            </div>
        </form>
    );
}
