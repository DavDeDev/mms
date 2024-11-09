import { columns } from "@/components/tables/cohort-members-table/columns";
import { DataTable } from "@/components/ui/data-table";
import { getCohortMembers } from "@/queries/cached-queries";

export default async function MemberListPage() {
	// TODO: pull cohort_id from route params or pass it down?
	const data = await getCohortMembers(39, 10, 0);
	return (
		<div className="container">
			<DataTable columns={columns} data={data} />
		</div>
	);
}
