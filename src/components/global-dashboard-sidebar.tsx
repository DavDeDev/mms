import type * as React from "react";

// import { TeamSwitcher } from "@/components/nav-cohort";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getUserProfile } from "@/queries/cached-queries";
import { GalleryVerticalEnd } from "lucide-react";

export async function GlobalDashboardSidebar({
	children,
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const user = await getUserProfile();
	return (
		<Sidebar variant="floating" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<a href="/">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<GalleryVerticalEnd className="size-4" />
								</div>
								<div className="flex flex-col gap-0.5 leading-none">
									<span className="font-semibold">LOGO</span>
									<span className="">v1.0.0</span>
								</div>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu className="gap-2">
						<CohortsNav />
						<AccountNav />
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
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
