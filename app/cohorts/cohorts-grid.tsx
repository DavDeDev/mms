import type { Tables } from "@/types";

export default async function CohortsGrid({
	cohorts,
}: { cohorts: Tables<"cohorts">[] }) {
	console.log(cohorts);
	return (
		<div className="flex items-center gap-4">
			<h1>Cohorts</h1>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Name
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Semester
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Year
						</th>
						<th
							scope="col"
							className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
						>
							Duration
						</th>
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{cohorts.map((cohort) => (
						<tr key={cohort.id}>
							<td className="px-6 py-4 whitespace-nowrap">{cohort.semester}</td>
							<td className="px-6 py-4 whitespace-nowrap">{cohort.semester}</td>
							<td className="px-6 py-4 whitespace-nowrap">
								{cohort.start_date}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">{cohort.end_date}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
