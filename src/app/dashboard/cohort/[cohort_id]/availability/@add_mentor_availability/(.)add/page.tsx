export const dynamic = "force-dynamic";

import { getUserProfile } from "@/queries/cached-queries";
import AddAvailabilityModal from "./add-availability-modal";

export default async function Page() {
	const user = await getUserProfile();
	return <AddAvailabilityModal />;
}
