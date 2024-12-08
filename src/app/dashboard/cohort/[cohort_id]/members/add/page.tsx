import { InviteUserToCohortForm } from "@/components/forms/add-member-to-cohort-form";

export default async function Page({
	params,
}: {
	params: Promise<{ cohort_id: number }>;
}) {
	const cohortId = (await params).cohort_id;
	return <InviteUserToCohortForm cohortId={cohortId} />;
}
