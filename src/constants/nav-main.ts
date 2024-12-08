import type { Enums } from "@/types";
import { BookOpen, Briefcase, Home, Settings, Users } from "lucide-react";

type UserRole = Enums<"cohort_role">;

interface NavItem {
	title: string;
	url: string;
	icon?: React.ElementType;
	isActive?: boolean;
	roles: UserRole[];
	items?: {
		title: string;
		url: string;
		roles: UserRole[];
	}[];
}

export const navMain: NavItem[] = [
	{
		title: "Dashboard",
		url: "/dashboard",
		icon: Home,
		isActive: true,
		roles: ["coordinator", "mentor", "mentee"],
	},
	{
		title: "Members",
		url: "/members",
		icon: Users,
		roles: ["coordinator", "mentor"],
		items: [
			{
				title: "All Members",
				url: "/members",
				roles: ["coordinator", "mentor"],
			},
			{ title: "Add Members", url: "/members/add", roles: ["coordinator"] },
		],
	},
	{
		title: "Programs",
		url: "/programs",
		icon: Briefcase,
		roles: ["coordinator", "mentor", "mentee"],
	},
	{
		title: "Resources",
		url: "/resources",
		icon: BookOpen,
		roles: ["coordinator", "mentor", "mentee"],
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
		roles: ["coordinator", "mentor", "mentee"],
	},
	{
		title: "Matching",
		url: "/matching",
		icon: Users,
		roles: ["coordinator", "mentor", "mentee"],
		items: [
			{
				title: "Matchings",
				url: "/matching",
				roles: ["coordinator", "mentee"],
			},
			{ title: "Availability", url: "/availability", roles: ["mentor"] },
		],
	},
];
