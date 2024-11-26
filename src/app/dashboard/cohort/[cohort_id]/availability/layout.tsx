"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const AvailabilityPageLayout = ({
	children,
	add_mentor_availability,
}: {
	children: React.ReactNode;
	add_mentor_availability: React.ReactNode;
}) => {
	return (
		<>
			<h1 className="text-2xl font-semibold mb-4">Mentor Availability</h1>

			<Link href={`${window.location.pathname}/add`}>
				<Button className="bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
					<PlusIcon className="h-4 w-4" />
					Add your availability
				</Button>
			</Link>
			{children}
			{add_mentor_availability}
		</>
	);
};

export default AvailabilityPageLayout;
