import { signOutAction } from "@/actions/auth-actions";
import { Button } from "./ui/button";

export function SignOutButton() {
	if (process.env.NODE_ENV === "production") return null;

	return (
		<form action={signOutAction} className="fixed bottom-1 right-1 z-50">
			<Button type="submit" variant="destructive">
				Sign out
			</Button>
		</form>
	);
}
