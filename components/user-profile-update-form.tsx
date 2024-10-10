"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function UserProfileUpdateForm() {
	const [isInternational, setIsInternational] = useState(false);
	const [profilePicture, setProfilePicture] = useState<string | null>(null);

	const campuses = ["Main Campus", "City Campus", "Satellite Campus"];
	const programs = [
		"Computer Science",
		"Business Administration",
		"Engineering",
		"Liberal Arts",
	];

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		// Here you would typically send the form data to your backend
		console.log("Form submitted");
	};

	const handleProfilePictureChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setProfilePicture(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Update Your Profile</CardTitle>
				<CardDescription>
					Make changes to your profile here. Click save when you're done.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label>Profile Picture</Label>
						<div className="flex items-center space-x-4">
							<Avatar className="w-24 h-24">
								<AvatarImage
									src={profilePicture || "/placeholder.svg"}
									alt="Profile picture"
								/>
								<AvatarFallback>UP</AvatarFallback>
							</Avatar>
							<Input
								id="picture"
								type="file"
								accept="image/*"
								onChange={handleProfilePictureChange}
							/>
						</div>
					</div>

					<Separator />

					<div>
						<h3 className="text-lg font-medium">Personal Information</h3>
						<p className="text-sm text-muted-foreground">
							Basic information about you.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="firstName">First Name</Label>
							<Input id="firstName" placeholder="John" />
						</div>
						<div className="space-y-2">
							<Label htmlFor="lastName">Last Name</Label>
							<Input id="lastName" placeholder="Doe" />
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="john@example.com"
							disabled
						/>
					</div>

					<div className="space-y-2">
						<Label>Sex</Label>
						<RadioGroup defaultValue="male">
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="male" id="male" />
								<Label htmlFor="male">Male</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="female" id="female" />
								<Label htmlFor="female">Female</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="other" id="other" />
								<Label htmlFor="other">Other</Label>
							</div>
						</RadioGroup>
					</div>

					<div className="space-y-2">
						<Label htmlFor="bio">Bio</Label>
						<Textarea id="bio" placeholder="Tell us about yourself" />
					</div>

					<Separator />

					<div>
						<h3 className="text-lg font-medium">Academic Information</h3>
						<p className="text-sm text-muted-foreground">
							Details about your studies.
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="campus">College Campus</Label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Select a campus" />
							</SelectTrigger>
							<SelectContent>
								{campuses.map((campus) => (
									<SelectItem
										key={campus}
										value={campus.toLowerCase().replace(" ", "-")}
									>
										{campus}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="program">Program of Studies</Label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Select a program" />
							</SelectTrigger>
							<SelectContent>
								{programs.map((program) => (
									<SelectItem
										key={program}
										value={program.toLowerCase().replace(" ", "-")}
									>
										{program}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="schoolId">School ID</Label>
						<Input id="schoolId" placeholder="Enter your school ID" />
					</div>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="international"
							checked={isInternational}
							onCheckedChange={() => setIsInternational(!isInternational)}
						/>
						<Label htmlFor="international">International Student</Label>
					</div>

					{isInternational && (
						<div className="space-y-2">
							<Label htmlFor="country">Country of Origin</Label>
							<Input id="country" placeholder="Enter your country" />
						</div>
					)}

					<Separator />

					<div>
						<h3 className="text-lg font-medium">Additional Information</h3>
						<p className="text-sm text-muted-foreground">
							Other details that help us match you better.
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="interests">Interests</Label>
						<Input
							id="interests"
							placeholder="e.g. Programming, Music, Sports"
						/>
					</div>

					<div className="bg-muted p-4 rounded-md">
						<p className="text-sm text-muted-foreground">
							Disclaimer: The information provided in this form is optional but
							will help our system to better match you with mentors or mentees,
							depending on your role. Your privacy is important to us, and this
							information will be used solely for the purpose of improving your
							experience on our platform.
						</p>
					</div>
				</form>
			</CardContent>
			<CardFooter>
				<Button type="submit" className="w-full">
					Save Changes
				</Button>
			</CardFooter>
		</Card>
	);
}
