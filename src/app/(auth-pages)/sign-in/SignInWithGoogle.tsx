"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Loader } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
	const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
	const supabase = createClient();

	const searchParams = useSearchParams();

	const redirectTo = searchParams.get("redirect_to");

	async function signInWithGoogle() {
		setIsGoogleLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: `${window.location.origin}/auth/callback${
						redirectTo ? `?redirect_to=${encodeURIComponent(redirectTo)}` : ""
					}`,
				},
			});

			if (error) {
				throw error;
			}
		} catch (error) {
			toast.error("Please try again.", {
				description: "There was an error logging in with Google.",
			});
			setIsGoogleLoading(false);
		}
	}

	return (
		<Button
			type="button"
			variant="outline"
			onClick={signInWithGoogle}
			disabled={isGoogleLoading}
		>
			{isGoogleLoading ?? <Loader className="m  r-2 size-4 animate-spin" />}{" "}
			Sign in with Google
		</Button>
	);
}
