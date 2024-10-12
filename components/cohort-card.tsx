"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { getUserCohortsQuery } from "@/queries";
import {
	ArchiveIcon,
	BellIcon,
	CalendarIcon,
	GraduationCapIcon,
	MoreVerticalIcon,
	UserIcon,
	UserPlusIcon,
	UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";

type Cohort = Awaited<ReturnType<Awaited<typeof getUserCohortsQuery>>>[number];

export function CohortCard({ cohort }: { cohort: Cohort }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const getSemesterColor = (semester: Cohort["semester"]) => {
		switch (semester) {
			case "fall":
				return "bg-orange-100 text-orange-800 hover:bg-orange-100/80";
			case "winter":
				return "bg-blue-100 text-blue-800 hover:bg-blue-100";
			case "summer":
				return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
			default:
				return;
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleLeaveTeam = () => {
		// Implement leave team logic here
		console.log("Leaving team...");
		setIsDialogOpen(false);
	};

	console.log(cohort);

	return (
		<Card className="w-full max-w-md mx-auto">
			<Link href={`/cohort/${cohort.cohort_id}`} className="block">
				<CardHeader className="flex flex-row items-center gap-4">
					<Avatar className="w-16 h-16">
						<AvatarImage
							src={cohort.image?.toString()}
							alt={`${cohort.semester} ${cohort.year} Cohort`}
						/>
						<AvatarFallback>
							{cohort.semester.charAt(0).toUpperCase()}
							{cohort.year.toString().slice(-2)}
						</AvatarFallback>
					</Avatar>
					<div className="flex-grow">
						<CardTitle className="text-2xl capitalize">
							{cohort.semester} {cohort.year}
						</CardTitle>
						<div className="flex items-center mt-1 text-sm text-muted-foreground">
							<CalendarIcon className="w-4 h-4 mr-1" />
							<Badge
								variant="muted"
								className={getSemesterColor(cohort.semester)}
							>
								{formatDate(cohort.start_date)} - {formatDate(cohort.end_date)}
							</Badge>
						</div>
					</div>
					<div className="relative">
						<BellIcon className="w-6 h-6 text-muted-foreground" />
						<Badge className="absolute -top-2 -right-2 px-1 min-w-[1.25rem] h-5">
							3
						</Badge>
					</div>
				</CardHeader>
			</Link>
			<CardContent>
				<div className="grid grid-cols-2 gap-4 mb-4">
					<div className="flex items-center">
						<UsersIcon className="w-5 h-5 mr-2 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Mentors</p>
							<p className="text-2xl font-bold">{cohort.mentor_count}</p>
						</div>
					</div>
					<div className="flex items-center">
						<GraduationCapIcon className="w-5 h-5 mr-2 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Mentees</p>
							<p className="text-2xl font-bold">{cohort.mentee_count}</p>
						</div>
					</div>
				</div>
				<div className="flex items-center justify-between pt-4 border-t">
					<div className="flex items-center">
						<UserIcon className="w-5 h-5 mr-2 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Coordinator</p>
							<p className="text-lg">
								{cohort.coordinator_name || "Not assigned"}
							</p>
						</div>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<MoreVerticalIcon className="w-4 h-4" />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onSelect={() => setIsDialogOpen(true)}>
								Leave Team
							</DropdownMenuItem>
							<DropdownMenuItem>
								<ArchiveIcon className="w-4 h-4 mr-2" />
								Archive Cohort
							</DropdownMenuItem>
							{!cohort.coordinator_name && (
								<DropdownMenuItem>
									<UserPlusIcon className="w-4 h-4 mr-2" />
									Add Coordinator
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</CardContent>

			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you sure you want to leave this team?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. You will lose access to all team
							resources and communications.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type="button"
							variant="secondary"
							onClick={() => setIsDialogOpen(false)}
						>
							Close
						</Button>
						<Button
							type="button"
							variant="destructive"
							onClick={handleLeaveTeam}
						>
							Leave Team
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Card>
	);
}
