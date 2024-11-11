import { columns } from "@/components/tables/cohort-members-table/columns";
import { DataTable } from "@/components/ui/data-table";
import type { getCohortMembers } from "@/queries/cached-queries";

export default async function MemberListPage({
	params,
}: {
	params: Promise<{ cohort_id: number }>;
}) {
	const cohortId = (await params).cohort_id;
	// const data = await getCohortMembers(cohortId);
	const names = [
		{ first_name: "Alice", last_name: "Johnson", nickname: "ali" },
		{ first_name: "Bob", last_name: "Smith", nickname: "bobby" },
		{ first_name: "Catherine", last_name: "Williams", nickname: "cathy" },
		{ first_name: "David", last_name: "Pietrocola", nickname: "dave" },
		{ first_name: "Eva", last_name: "Brown", nickname: "evie" },
		{ first_name: "Frank", last_name: "Wilson", nickname: "frankie" },
		{ first_name: "Grace", last_name: "Taylor", nickname: "grace" },
		{ first_name: "Henry", last_name: "Anderson", nickname: "hen" },
		{ first_name: "Ivy", last_name: "Thomas", nickname: "ivy" },
		{ first_name: "Jack", last_name: "White", nickname: "jackie" },
		// Add more names as needed
	];

	const roles = ["admin", "mentor", "mentee", "coordinator"] as const;

	const data: Awaited<ReturnType<typeof getCohortMembers>> = Array.from(
		{ length: 40 },
		(_, index) => {
			const name = names[index % names.length];
			const randomRole = roles[Math.floor(Math.random() * roles.length)];
			const randomNumber = Math.floor(10 + Math.random() * 90); // random two-digit number

			// Email generation using nickname, first name, last name, and random number
			const email = `${name.nickname}${randomNumber}_${name.first_name.toLowerCase()}${name.last_name.toLowerCase()}@example.com`;

			return {
				role: randomRole,
				member: {
					id: `id_${index}`,
					first_name: name.first_name,
					last_name: name.last_name,
					email: email,
					avatar_url: `https://example.com/avatar${index}.png`,
					school_id: index,
					campus: "Progress",
				},
			};
		},
	);

	return <DataTable columns={columns} data={data} />;
}
