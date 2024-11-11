import {
	BookOpen,
	Briefcase,
	ChevronRight,
	Home,
	Settings,
	Users,
} from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const navMain = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Home,
		isActive: true,
	},
	{
		title: "Members",
		url: "/members",
		icon: Users,
		items: [
			{ title: "All Members", url: "/members" },
			{ title: "Add Mentee", url: "/mentees/add" },
		],
	},
	{
		title: "Programs",
		url: "/programs",
		icon: Briefcase,
	},
	{
		title: "Resources",
		url: "/resources",
		icon: BookOpen,
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
	},
	{
		title: "Matching",
		url: "/matching",
		icon: Users,
		items: [
			{ title: "Matchings", url: "/matching" },
			{ title: "Add Mentee", url: "/mentees/add" },
		],
	},
];

export function NavMain({ cohortId }: { cohortId: number }) {
	const basePath = `/dashboard/cohort/${cohortId}/`;
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{navMain.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<a href={`${basePath}${subItem.url}`}>
													{" "}
													<span>{subItem.title}</span>
												</a>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
