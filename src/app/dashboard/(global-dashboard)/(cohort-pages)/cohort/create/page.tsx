import { getUserProfile } from "@/queries/cached-queries";
import CreateCohortForm from "../../../../../components/forms/create-cohort-form";

export default async function Page() {
	const user = await getUserProfile();

	return (
		<div className="container">
			<CreateCohortForm userEmail={user.email} />
		</div>
	);
}
