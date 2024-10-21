import { getUserProfile } from "@/queries/cached-queries";
import { redirect } from "next/navigation";
import CreateCohortModal from "./create-cohort-modal";

export default async function Page() {
	const user = await getUserProfile();

	if (!user?.data) {
		return redirect("/sign-in");
	}

	return (
		<div className="container">
			<CreateCohortModal userEmail={user.data.email} />
		</div>
	);
}
