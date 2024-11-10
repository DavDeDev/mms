import { columns } from "@/components/tables/cohort-members-table/columns";
import { DataTable } from "@/components/ui/data-table";

export default async function MemberListPage({
	params,
}: {
	params: Promise<{ cohort_id: number }>;
}) {
	const cohortId = (await params).cohort_id;
	// const data = await getCohortMembers(cohortId);
	const data: {
		role: "admin" | "mentor" | "mentee" | "coordinator";
		member: {
			id: string;
			first_name: string | null;
			last_name: string | null;
			email: string;
			avatar_url: string | null;
		};
	}[] = Array.from({ length: 40 }, (_, index) => ({
		role: ["admin", "mentor", "mentee", "coordinator"][index % 4] as
			| "admin"
			| "mentor"
			| "mentee"
			| "coordinator",
		member: {
			id: `id_${index}`,
			first_name: `FirstName_${index}`,
			last_name: `LastName_${index}`,
			email: `user${index}@example.com`,
			avatar_url: `https://example.com/avatar${index}.png`,
		},
	}));

	return (
		<div className="container">
			<DataTable columns={columns} data={data} />
		</div>
	);
}
