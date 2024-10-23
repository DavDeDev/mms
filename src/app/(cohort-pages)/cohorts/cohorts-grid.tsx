"use client";

import { CohortCard } from "components/cohort-card";
import { Button } from "components/ui/button";
import type { getUserCohortsQuery } from "@/queries";
import type { Database } from "@/types";
import { GridIcon, ListIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Cohorts = Awaited<ReturnType<Awaited<typeof getUserCohortsQuery>>>;

export function CohortDisplay({
	cohorts,
	userRole,
}: {
	cohorts: Cohorts;
	userRole: Database["public"]["Enums"]["app_role"];
}) {
	const [isGridView, setIsGridView] = useState(true);
	return (
		<div>
			<div className="flex justify-between mb-4">
				{userRole === "admin" && (
					<Link href="/cohort/create">
						<Button>
							<PlusIcon className="w-4 h-4 mr-2" />
							Add Cohort
						</Button>
					</Link>
				)}
				<div className="flex">
					<Button
						variant="outline"
						size="icon"
						onClick={() => setIsGridView(true)}
						className={isGridView ? "bg-primary text-primary-foreground" : ""}
					>
						<GridIcon className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => setIsGridView(false)}
						className={!isGridView ? "bg-primary text-primary-foreground" : ""}
					>
						<ListIcon className="h-4 w-4" />
					</Button>
				</div>
			</div>
			{isGridView ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{cohorts.map((cohort) => (
						<CohortCard key={cohort.cohort_id} cohort={cohort} />
					))}
				</div>
			) : (
				<div className="space-y-2">
					{cohorts.map((cohort) => (
						<CohortCard
							key={cohort.cohort_id}
							cohort={cohort}
							isListView={true}
						/>
					))}
				</div>
			)}
		</div>
	);
}
