"use client";

import { Button } from "components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import type { getUserCohortsQuery } from "@/queries";
import {
	ArchiveIcon,
	BellIcon,
	CalendarIcon,
	EditIcon,
	GraduationCapIcon,
	LogOutIcon,
	MoreVerticalIcon,
	ShareIcon,
	StarIcon,
	UserIcon,
	UserPlusIcon,
	UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Cohort = Awaited<ReturnType<Awaited<typeof getUserCohortsQuery>>>[number];

export function CohortCard({
	cohort,
	isListView = false,
}: { cohort: Cohort; isListView?: boolean }) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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

	const totalMembers = cohort.mentor_count + cohort.mentee_count;

	const ContextMenu = () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreVerticalIcon className="w-4 h-4" />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>
					<EditIcon className="w-4 h-4 mr-2" />
					Edit Cohort
				</DropdownMenuItem>
				<DropdownMenuItem>
					<ShareIcon className="w-4 h-4 mr-2" />
					Share Cohort
				</DropdownMenuItem>
				<DropdownMenuItem>
					<StarIcon className="w-4 h-4 mr-2" />
					Mark as Favorite
				</DropdownMenuItem>
				{!cohort.coordinator_name && (
					<DropdownMenuItem>
						<UserPlusIcon className="w-4 h-4 mr-2" />
						Add Coordinator
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<DropdownMenuItem className="text-yellow-600">
					<ArchiveIcon className="w-4 h-4 mr-2" />
					Archive Cohort
				</DropdownMenuItem>
				<DropdownMenuItem
					className="text-destructive"
					onSelect={() => setIsDialogOpen(true)}
				>
					<LogOutIcon className="w-4 h-4 mr-2" />
					Leave Team
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);

	if (isListView) {
		return (
			<div className="flex items-center justify-between py-4 border-b last:border-b-0">
				<div className="flex items-center space-x-4">
					<div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
						{cohort.avatar_url ? (
							<img
								src={cohort.avatar_url}
								alt={`${cohort.semester} ${cohort.year} Cohort`}
								className="w-full h-full object-cover"
							/>
						) : (
							<span className="text-2xl font-bold text-gray-500">
								{cohort.semester === "summer" ? "S24" : "W23"}
							</span>
						)}
					</div>
					<div>
						<h3 className="font-semibold">
							{cohort.semester} {cohort.year}
						</h3>
						<p className="text-sm text-muted-foreground">
							{totalMembers} members
						</p>
						<p className="text-sm text-muted-foreground">
							{formatDate(cohort.start_date)} - {formatDate(cohort.end_date)}
						</p>
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<div>
						<p className="text-sm font-medium">Coordinator</p>
						<p className="text-sm">
							{cohort.coordinator_name || "Not assigned"}
						</p>
					</div>
					<ContextMenu />
				</div>
			</div>
		);
	}

	return (
		<Card className="w-full h-full flex flex-col">
			<CardHeader className="p-0">
				<div className="relative pb-[56.25%]">
					<img
						src={
							cohort.avatar_url?.toString() ||
							"/placeholder.svg?height=180&width=320"
						}
						alt={`${cohort.semester} ${cohort.year} Cohort`}
						className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
					/>
				</div>
			</CardHeader>
			<CardContent className="flex-grow flex flex-col p-4">
				<Link href={`/cohort/${cohort.cohort_id}`} className="block mb-4">
					<CardTitle className="text-2xl capitalize mb-2">
						{cohort.semester} {cohort.year}
					</CardTitle>
					<div className="flex items-center text-sm text-muted-foreground">
						<CalendarIcon className="w-4 h-4 mr-1" />
						{formatDate(cohort.start_date)} - {formatDate(cohort.end_date)}
					</div>
				</Link>
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
				<div className="flex items-center justify-between mt-auto pt-4 border-t">
					<div className="flex items-center">
						<UserIcon className="w-5 h-5 mr-2 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Coordinator</p>
							<p className="text-lg">
								{cohort.coordinator_name || "Not assigned"}
							</p>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						<div className="relative">
							<BellIcon className="w-6 h-6 text-muted-foreground" />
							<div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
						</div>
						<ContextMenu />
					</div>
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
							Cancel
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
