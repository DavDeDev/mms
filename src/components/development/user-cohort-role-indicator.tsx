import type { Enums } from "@/types";

// Define the color map for each role
const roleStyles: Record<
	Enums<"cohort_role">,
	{ bgColor: string; label: string }
> = {
	admin: { bgColor: "bg-red-600", label: "Admin" },
	mentor: { bgColor: "bg-green-600", label: "Mentor" },
	mentee: { bgColor: "bg-blue-600", label: "Mentee" },
	coordinator: { bgColor: "bg-yellow-600", label: "Guest" },
};

export function UserCohortRole({
	userRole,
}: { userRole: Enums<"cohort_role"> }) {
	if (process.env.NODE_ENV === "production") return null;

	// Use the roleStyles map to get the appropriate style or fallback to "default"
	const { bgColor, label } = roleStyles[userRole];

	return (
		<div
			className={`fixed bottom-12 right-0 z-50 flex h-8 items-center justify-center rounded-lg ${bgColor} p-3 px-4 font-mono text-sm text-white shadow-lg`}
		>
			<span className="font-bold">{label}</span>
		</div>
	);
}
