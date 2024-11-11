"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CopyTextComponent from "@/components/ui/copy-text";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { getCohortMembers } from "@/queries/cached-queries";
import { CohortRole } from "@/types/enums";
import { getCohortRoleColors } from "@/utils/utils";
import { compareItems, rankItem } from "@tanstack/match-sorter-utils";
import { type ColumnDef, sortingFns } from "@tanstack/react-table";
import { MoreHorizontal, User } from "lucide-react";

export type CohortMember = Awaited<ReturnType<typeof getCohortMembers>>[number];

const roleOptions = {
	[CohortRole.admin]: { label: "Admin", icon: User },
	[CohortRole.mentor]: { label: "Mentor", icon: User },
	[CohortRole.mentee]: { label: "Mentee", icon: User },
	[CohortRole.coordinator]: { label: "Coordinator", icon: User },
};

// Generate filterOptions based on the CohortRole enum
const filterOptions = Object.values(CohortRole).map((role) => ({
	label: roleOptions[role].label,
	value: role,
	icon: roleOptions[role].icon,
}));

export const columns: ColumnDef<CohortMember>[] = [
	{
		header: "Member",
		meta: {
			searchBarPlaceholder: "Search by member name",
		},
		cell: ({ row }) => {
			const member = {
				...row.original.member,
				role: row.original.role,
			};
			return (
				<div className="flex items-center gap-3">
					<Avatar>
						<AvatarImage
							src={member.avatar_url ?? undefined}
							alt={`${member.first_name} ${member.last_name}`}
						/>
						<AvatarFallback>
							{member.first_name}
							{member.last_name}
						</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium">
							{member.first_name} {member.last_name}
						</div>
						<CopyTextComponent>{member.email}</CopyTextComponent>
					</div>
				</div>
			);
		},
		filterFn: (row, columnId, value, addMeta) => {
			// Retrieve member information directly
			const member = row.original.member;
			const role = row.original.role;

			// Combine all searchable fields into a single string for flexible matching or add it as metadata
			const searchableText = [
				member.first_name,
				member.last_name,
				member.email,
				role,
			]
				.filter(Boolean)
				.join(" ");

			const searchValue = value.toLowerCase();

			const itemRank = rankItem(searchableText, searchValue);

			addMeta({ itemRank });

			// Return whether the item matches the search
			return itemRank.passed;
		},
		sortingFn: (rowA, rowB, columnId) => {
			let dir = 0;

			// Only sort by rank if the column has ranking information
			if (rowA.columnFiltersMeta[columnId]) {
				dir = compareItems(
					rowA.columnFiltersMeta[columnId]?.itemRank!,
					rowB.columnFiltersMeta[columnId]?.itemRank!,
				);
			}

			// Provide an alphanumeric fallback for when the item ranks are equal
			return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
		},
	},
	{
		accessorKey: "role",
		meta: {
			filterOptions,
		},
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		cell: ({ row }) => {
			return (
				<Badge
					className={`${getCohortRoleColors(row.original.role)}  capitalize`}
				>
					{row.original.role}
				</Badge>
			);
		},
		filterFn: (row, id, value) => {
			return value.includes(row.getValue(id));
		},
	},
	{
		id: "school id",
		accessorKey: "member.school_id",
		header: "School ID",
	},
	{
		id: "campus",
		accessorKey: "member.campus",
		header: "Campus",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const { member } = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(
									member.school_id?.toString() ?? "",
								)
							}
						>
							Copy Student ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Don't know</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
