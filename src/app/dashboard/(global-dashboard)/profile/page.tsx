import UserProfileUpdateForm from "@/components/forms/user-profile-form";
import { getUserProfile } from "@/queries/cached-queries";

export default async function UpdateProfilePage() {
	const user = await getUserProfile();

	return <UserProfileUpdateForm user={user} />;
}
