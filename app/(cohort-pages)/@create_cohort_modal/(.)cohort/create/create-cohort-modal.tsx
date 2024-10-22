"use client";

import CreateCohortForm from "@/app/(cohort-pages)/cohort/create/create-cohort-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

export default function CreateCohortModal({
	userEmail,
}: { userEmail: string }) {
	const router = useRouter();
	return (
		<Dialog open onOpenChange={() => router.back()}>
			<DialogContent className="container">
				<DialogTitle className="hidden">Create Cohort</DialogTitle>
				<div className="container">
					<CreateCohortForm userEmail={userEmail} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
