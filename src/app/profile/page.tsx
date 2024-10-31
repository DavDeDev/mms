import { getUserProfile } from "@/queries/cached-queries";
import UserProfileUpdateForm from "components/user-profile-form";

export default async function UpdateProfilePage() {
	const user = await getUserProfile();

	return <UserProfileUpdateForm user={user} />;
}
