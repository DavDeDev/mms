"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { getCohortMembers } from "@/queries/cached-queries";
import { getCohortRoleColors } from "@/utils/utils";
import type { ColumnDef } from "@tanstack/react-table";

export type CohortMember = Awaited<ReturnType<typeof getCohortMembers>>[number];

export const columns: ColumnDef<CohortMember>[] = [
	{
		header: "Member",
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
						<div className="text-sm text-muted-foreground">{member.email}</div>
					</div>
				</div>
			);
		},
	},
	{
		header: "Role",
		cell: ({ row }) => {
			return (
				<Badge
					className={`${getCohortRoleColors(row.original.role)}  capitalize`}
				>
					{row.original.role}
				</Badge>
			);
		},
	},
];
