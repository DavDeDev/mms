import { columns } from "@/components/tables/cohort-members-table/columns";
import { DataTable } from "@/components/ui/data-table";
import { getCohortMembers } from "@/queries/cached-queries";

export default async function MemberListPage({
	params,
}: {
	params: Promise<{ cohort_id: number }>;
}) {
	const cohortId = (await params).cohort_id;
	const data = await getCohortMembers(cohortId);
	// const data: Awaited<ReturnType<typeof getCohortMembers>> = Array.from(
	// 	{ length: 40 },
	// 	(_, index) => ({
	// 		role: ["admin", "mentor", "mentee", "coordinator"][index % 4] as
	// 			| "admin"
	// 			| "mentor"
	// 			| "mentee"
	// 			| "coordinator",
	// 		member: {
	// 			id: `id_${index}`,
	// 			first_name: `FirstName_${index}`,
	// 			last_name: `LastName_${index}`,
	// 			email: `user${index}@example.com`,
	// 			avatar_url: `https://example.com/avatar${index}.png`,
	// 			school_id: index,
	// 			campus: "Progress",
	// 		},
	// 	}),
	// );

	return (
		<div className="container">
			<DataTable columns={columns} data={data} />
		</div>
	);
}
