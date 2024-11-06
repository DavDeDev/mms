import type * as React from "react";

// import { TeamSwitcher } from "@/components/nav-cohort";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { getUserCohorts, getUserProfile } from "@/queries/cached-queries";
import CohortSwitcher from "./cohort-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export async function CohortDashboardSidebar({
	children,
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const cohorts = await getUserCohorts();
	const user = await getUserProfile();
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<CohortSwitcher cohorts={cohorts} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			<SidebarFooter>
				<NavUser {...user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
