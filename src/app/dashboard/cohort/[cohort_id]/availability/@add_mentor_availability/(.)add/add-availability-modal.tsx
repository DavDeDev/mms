"use client";

import MentorAvailabilityForm from "@/components/forms/add-mentor-availability-form";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "components/ui/dialog";
import { useRouter } from "next/navigation";

export default function AddAvailabilityModal({
	cohortId,
}: { cohortId: number }) {
	const router = useRouter();
	const handleClose = () => {
		router.back();
	};

	const handleSubmitSuccess = () => {
		handleClose();
	};
	return (
		<Dialog open onOpenChange={handleClose}>
			<DialogContent className="container w-fit">
				<DialogTitle className="hidden">Add Availability</DialogTitle>
				<div className="p-1">
					<MentorAvailabilityForm
						cohortId={cohortId}
						onSubmitSuccess={handleSubmitSuccess}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
