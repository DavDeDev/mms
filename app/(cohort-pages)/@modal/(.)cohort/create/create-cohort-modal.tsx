"use client";

import CreateCohortForm from "@/app/(cohort-pages)/cohort/create/create-cohort-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

export default function CreateCohortModal({
	userEmail,
}: { userEmail: string }) {
	const router = useRouter();
	return (
		<Dialog open onOpenChange={() => router.back()}>
			<DialogContent className="w-4/5">
				<CreateCohortForm userEmail={userEmail} />
			</DialogContent>
		</Dialog>
	);
}
