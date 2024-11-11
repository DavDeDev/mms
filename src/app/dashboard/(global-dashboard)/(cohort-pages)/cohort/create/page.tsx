import CreateCohortForm from "@/components/forms/create-cohort-form";
import { getUserProfile } from "@/queries/cached-queries";

export default async function Page() {
	const user = await getUserProfile();

	return (
		<div className="container">
			<CreateCohortForm userEmail={user.email} />
		</div>
	);
}
