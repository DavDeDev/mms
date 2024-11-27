export const dynamic = "force-dynamic";

import AddAvailabilityModal from "./add-availability-modal";

export default async function Page({
	params,
}: { params: Promise<{ cohort_id: number }> }) {
	const { cohort_id } = await params;
	return <AddAvailabilityModal cohortId={cohort_id} />;
}
