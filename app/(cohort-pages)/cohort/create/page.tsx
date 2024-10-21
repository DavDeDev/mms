import { getUserProfile } from "@/queries/cached-queries";
import { redirect } from "next/navigation";
import CreateCohortForm from "./create-cohort-form";

export default async function Page() {
	const user = await getUserProfile();

	if (!user?.data) {
		return redirect("/sign-in");
	}

	return <CreateCohortForm userEmail={user.data.email} />;
}
