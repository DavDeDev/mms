"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { signOutAction } from "@/actions/auth-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import type { getUserProfile } from "@/queries/cached-queries";
import type { Enums } from "@/types";
import { getCohortRoleColors } from "@/utils/utils";
import Link from "next/link";
import { ThemeSwitcher } from "./theme-switcher";
import { Badge } from "./ui/badge";

type User = Awaited<ReturnType<Awaited<typeof getUserProfile>>> & {
	cohort_role?: Enums<"cohort_role">; // Make cohort_role optional
};

export function NavUser({ user }: { user: User }) {
	const { isMobile } = useSidebar();

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim();
	const initials = getInitials(fullName || user.email || "Unknown User");

	// Get the cohort role color only if cohort_role is present
	const cohortRoleColor = user.cohort_role
		? getCohortRoleColors(user.cohort_role)
		: "";

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${cohortRoleColor}`}
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user.avatar_url || ""}
									alt={fullName || "User avatar"}
								/>
								<AvatarFallback className="rounded-lg">
									{initials}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{fullName || "Unknown User"}
								</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							{/* Only render Badge if cohort_role is present */}
							{user.cohort_role && (
								<Badge
									variant="outline"
									className={`ml-auto capitalize ${cohortRoleColor}`}
								>
									{user.cohort_role}
								</Badge>
							)}
							<ChevronsUpDown className="ml-2 size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.avatar_url || ""}
										alt={fullName || "User avatar"}
									/>
									<AvatarFallback className="rounded-lg">
										{initials}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">
										{fullName || "Unknown User"}
									</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
								{/* Only render Badge if cohort_role is present */}
								{user.cohort_role && (
									<Badge
										variant="outline"
										className={`capitalize ${cohortRoleColor}`}
									>
										{user.cohort_role}
									</Badge>
								)}
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<ThemeSwitcher className="mr-2" renderSwitcher />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/dashboard/profile">
									<BadgeCheck className="mr-2" />
									Account
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell className="mr-2" />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<form action={signOutAction}>
							<DropdownMenuItem asChild>
								<Button variant="ghost" className="w-full justify-start">
									<LogOut className="mr-2" />
									Log out
								</Button>
							</DropdownMenuItem>
						</form>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
