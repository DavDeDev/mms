"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import type { getCohortMentors } from "@/queries/cached-queries";
import { Calendar, Clock, GraduationCap, MapPin } from "lucide-react";

// Mock data types
type Mentor = Awaited<ReturnType<Awaited<typeof getCohortMentors>>>[number];

export default function EnhancedMentorCard({
	mentor,
}: {
	mentor: Mentor;
}) {
	const { mentorProfile, mentorAvailability } = mentor;

	const getInitials = (firstName: string | null, lastName: string | null) => {
		return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
	};

	const formatAvailability = (availability: Mentor["mentorAvailability"]) => {
		return availability.map((slot) => (
			<div key={slot.id} className="flex items-center gap-2 text-sm">
				<Calendar className="h-4 w-4 text-muted-foreground" />
				<span className="font-medium">{slot.day_of_week}</span>
				<Clock className="h-4 w-4 text-muted-foreground" />
				<span>
					{slot.start_time} - {slot.end_time}
				</span>
			</div>
		));
	};

	return (
		<Card className="w-full max-w-md overflow-hidden">
			<CardHeader className="pb-2">
				<div className="flex items-center gap-4">
					<Avatar className="h-16 w-16">
						<AvatarImage
							src={mentorProfile.avatar_url || undefined}
							alt={`${mentorProfile.first_name} ${mentorProfile.last_name}`}
						/>
						<AvatarFallback>
							{getInitials(mentorProfile.first_name, mentorProfile.last_name)}
						</AvatarFallback>
					</Avatar>
					<div>
						<h2 className="text-xl font-bold">
							{mentorProfile.first_name} {mentorProfile.last_name}
						</h2>
						<p className="text-muted-foreground flex items-center gap-1">
							<GraduationCap className="h-4 w-4" />
							{mentorProfile.program_of_study || "Program not specified"}
						</p>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="bg-primary/5 p-4 rounded-lg">
					<h3 className="font-semibold mb-2 text-primary">Available Times</h3>
					<div className="space-y-2">
						{formatAvailability(mentorAvailability)}
					</div>
				</div>
				<div className="flex flex-wrap gap-2">
					<Badge variant="secondary" className="bg-blue-100 text-blue-800">
						{mentorProfile.campus || "Campus not specified"}
					</Badge>
					{mentorProfile.is_international && (
						<Badge variant="secondary" className="bg-green-100 text-green-800">
							International
						</Badge>
					)}
					{mentorProfile.country_of_origin && (
						<Badge variant="outline">
							<MapPin className="h-3 w-3 mr-1" />
							{mentorProfile.country_of_origin}
						</Badge>
					)}
				</div>
				<p className="text-sm">{mentorProfile.bio || "No bio provided"}</p>
				{mentorProfile.interests && mentorProfile.interests.length > 0 && (
					<div>
						<h3 className="font-semibold mb-2">Interests</h3>
						<div className="flex flex-wrap gap-2">
							{mentorProfile.interests.map((interest, index) => (
								<Badge key={index} variant="secondary">
									{interest}
								</Badge>
							))}
						</div>
					</div>
				)}
			</CardContent>
			<CardFooter>
				<Button className="w-full">Choose This Mentor</Button>
			</CardFooter>
		</Card>
	);
}
