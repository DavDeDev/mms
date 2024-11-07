"use client";

import {
	BookOpen,
	Briefcase,
	ChevronRight,
	Home,
	Settings,
	UserCheck,
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
		title: "Mentees",
		url: "/mentees",
		icon: Users,
		items: [
			{ title: "All Mentees", url: "/mentees" },
			{ title: "Add Mentee", url: "/mentees/add" },
		],
	},
	{
		title: "Mentors",
		url: "/mentors",
		icon: UserCheck,
		items: [
			{ title: "All Mentors", url: "/mentors" },
			{ title: "Add Mentor", url: "/mentors/add" },
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
];

export function NavMain() {
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
												<a href={subItem.url}>
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
