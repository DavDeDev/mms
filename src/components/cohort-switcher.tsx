"use client";

import { format } from "date-fns";
import {
	Calendar,
	ChevronRight,
	ChevronsUpDown,
	GraduationCap,
	Users,
} from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import type { getUserCohortsQuery } from "@/queries";
import { useParams } from "next/navigation";

type Cohort = Awaited<ReturnType<Awaited<typeof getUserCohortsQuery>>>[number];

import { useRouter } from "next/navigation";

export default function CohortSwitcher({ cohorts }: { cohorts: Cohort[] }) {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const params = useParams<{ cohort_id: string }>();
	const [activeCohort, setActiveCohort] = React.useState<Cohort | null>(
		cohorts?.find(
			(cohort) => cohort.cohort_id === Number.parseInt(params.cohort_id),
		) || (cohorts?.length > 0 ? cohorts[0] : null),
	);
	if (!cohorts?.length) {
		return null;
	}

	const formatSemester = (semester: string) => {
		return semester.charAt(0).toUpperCase() + semester.slice(1);
	};

	const handleCohortChange = (cohort: Cohort) => {
		setActiveCohort(cohort);
		router.push(`/dashboard/${cohort.cohort_id}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<SidebarMenuButton
					size="lg"
					className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
				>
					<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<GraduationCap className="size-4" />
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">
							{formatSemester(activeCohort?.semester || "")}{" "}
							{activeCohort?.year}
						</span>
						<span className="truncate text-xs">
							{format(new Date(activeCohort?.start_date || ""), "MMM d")} -{" "}
							{format(new Date(activeCohort?.end_date || ""), "MMM d")}
						</span>
					</div>
					<ChevronsUpDown className="ml-auto size-4" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
				align="start"
				side={isMobile ? "bottom" : "right"}
				sideOffset={8}
			>
				<DropdownMenuLabel className="text-xs text-muted-foreground">
					Active Cohorts
				</DropdownMenuLabel>
				{cohorts.map((cohort) => (
					<DropdownMenuItem
						key={cohort.cohort_id}
						onClick={() => handleCohortChange(cohort)}
						className="gap-2 p-2"
					>
						<Avatar className="size-6">
							{cohort.avatar_url ? (
								<AvatarImage
									src={cohort.avatar_url}
									alt={`${cohort.semester} ${cohort.year}`}
								/>
							) : (
								<AvatarFallback className="bg-primary/10">
									{formatSemester(cohort.semester).charAt(0)}
									{cohort.year.toString().slice(-2)}
								</AvatarFallback>
							)}
						</Avatar>
						<div className="flex-1">
							<p className="text-sm font-medium leading-none">
								{formatSemester(cohort.semester)} {cohort.year}
							</p>
							<p className="text-xs text-muted-foreground">
								{format(new Date(cohort.start_date), "MMM d")} -{" "}
								{format(new Date(cohort.end_date), "MMM d")}
							</p>
						</div>
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<div className="flex items-center gap-1">
								<Users className="size-3" />
								<span>{cohort.mentee_count}</span>
							</div>
							<ChevronRight className="size-3 opacity-50" />
							<div className="flex items-center gap-1">
								<GraduationCap className="size-3" />
								<span>{cohort.mentor_count}</span>
							</div>
						</div>
					</DropdownMenuItem>
				))}
				<DropdownMenuSeparator />
				<DropdownMenuItem className="gap-2 p-2">
					<Calendar className="size-4 text-muted-foreground" />
					<span className="font-medium text-muted-foreground">
						View Calendar
					</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
