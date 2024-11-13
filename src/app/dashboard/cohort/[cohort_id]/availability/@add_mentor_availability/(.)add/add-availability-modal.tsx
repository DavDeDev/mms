"use client";

import MentorAvailabilityForm from "@/components/forms/add-mentor-availability";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "components/ui/dialog";
import { useRouter } from "next/navigation";

export default function AddAvailabilityModal({
	cohortId,
}: { cohortId: number }) {
	const router = useRouter();
	return (
		<Dialog open onOpenChange={() => router.back()}>
			<DialogContent className="container w-fit">
				<DialogTitle className="hidden">Add Availability</DialogTitle>
				<div className="p-1">
					<MentorAvailabilityForm cohortId={cohortId} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
