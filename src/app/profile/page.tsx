import UserProfileUpdateForm from "components/user-profile-form";
import { getUserProfile } from "@/queries/cached-queries";
import { redirect } from "next/navigation";

export default async function UpdateProfilePage() {
	const user = await getUserProfile();

	if (!user?.data) {
		return redirect("/sign-in");
	}
	return <UserProfileUpdateForm user={user.data} />;
}
