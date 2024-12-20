import { ChevronRight } from "lucide-react";

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
import { navMain } from "@/constants/nav-main";
import type { Enums } from "@/types";

interface NavMainProps {
	cohortId: number;
	userRole: Enums<"cohort_role">;
}

export function NavMain({ cohortId, userRole }: NavMainProps) {
	const basePath = `/dashboard/cohort/${cohortId}/`;

	const filteredNavMain = navMain.filter((item) =>
		item.roles.includes(userRole),
	);

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{filteredNavMain.map((item) => (
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
									{item.items && (
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									)}
								</SidebarMenuButton>
							</CollapsibleTrigger>
							{item.items && (
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items
											.filter((subItem) => subItem.roles.includes(userRole))
											.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton asChild>
														<a href={`${basePath}${subItem.url}`}>
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
									</SidebarMenuSub>
								</CollapsibleContent>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
