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

	return (
		<div className="container">
			<DataTable columns={columns} data={data} />
		</div>
	);
}
