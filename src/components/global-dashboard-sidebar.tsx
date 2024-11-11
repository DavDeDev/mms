import type * as React from "react";

// import { TeamSwitcher } from "@/components/nav-cohort";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarRail,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import { getUserProfile } from "@/queries/cached-queries";

export async function GlobalDashboardSidebar({
	children,
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const user = await getUserProfile();
	return (
		<Sidebar className="h-screen" collapsible="none" {...props}>
			<SidebarHeader>
				{/* TODO: Insert a LOGO */}
				LOGO
			</SidebarHeader>
			<SidebarContent>
				<SidebarSeparator />
				<CohortsNav />
				<SidebarSeparator />
				<AccountNav />
				{/* <NavProjects projects={data.projects} /> */}
			</SidebarContent>
			<SidebarFooter>{/* <NavUser {...user} /> */}</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}

function CohortsNav() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Cohorts</SidebarGroupLabel>
			<SidebarMenu>
				{/* A button that redirects to /dashboard/cohorts to show all cohorts */}
				<SidebarMenuButton asChild>
					<a href="/dashboard/cohorts">All Cohorts</a>
				</SidebarMenuButton>
			</SidebarMenu>
		</SidebarGroup>
	);
}

function AccountNav() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Account</SidebarGroupLabel>
			<SidebarMenu>
				<SidebarMenuButton asChild>
					<a href="/dashboard/profile">Profile</a>
				</SidebarMenuButton>
			</SidebarMenu>
		</SidebarGroup>
	);
}
