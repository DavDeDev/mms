"use client";

import { updateUserAction } from "@/actions/update-profile-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
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
import { updateUserSchema } from "@/mutations/schema";
import type { Tables } from "@/types";
import { CollegeCampuses, type UserSex } from "@/types/enums";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type * as z from "zod";
import InterestsInput from "./interests-input";

export default function UserProfileUpdateForm({
	user,
}: { user: Tables<"users"> }) {
	console.log("USER", user);
	const supabase = createClient();
	const [isInternational, setIsInternational] = useState(user.is_international);
	const [profilePicture, setProfilePicture] = useState<string | null>(
		user.avatar_url,
	);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const form = useForm<z.infer<typeof updateUserSchema>>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			firstName: user.first_name ?? "",
			lastName: user.last_name ?? "",
			email: user.email ?? "",
			bio: user.bio ?? "",
			sex: (user.sex as UserSex) ?? undefined,
			campus: (user.campus as CollegeCampuses) ?? undefined,
			program: user.program_of_study ?? undefined,
			schoolId: user.school_id ?? 0,
			isInternational: user.is_international ?? false,
			country: user.country_of_origin ?? "",
			interests: user.interests ?? [],
			avatarUrl: user.avatar_url,
		},
	});

	// TODO: improve error handling
	const onSubmit = form.handleSubmit(
		async (values: z.infer<typeof updateUserSchema>) => {
			let avatarUrl = values.avatarUrl;

			if (selectedFile) {
				try {
					const uid = user.id; // Ensure you have a unique identifier for the user
					const fileExt = selectedFile.name.split(".").pop();
					const filePath = `${uid}-${Math.random()}.${fileExt}`;

					const { data, error } = await supabase.storage
						.from("avatars")
						.upload(filePath, selectedFile, { upsert: true });

					if (error) {
						toast.error("Failed to upload avatar. Please try again.");
						return;
					}

					avatarUrl = supabase.storage.from("avatars").getPublicUrl(data.path)
						.data.publicUrl;
				} catch (uploadError) {
					console.error("Error uploading avatar:", uploadError);
					return;
				}
			}

			try {
				const updatedValues = { ...values, avatarUrl };
				const { success, data, error } = await updateUserAction(updatedValues);
				if (success) {
					toast.success("Profile updated successfully");
					if (avatarUrl) {
						setProfilePicture(avatarUrl);
						setSelectedFile(null);
					}
				} else {
					console.error("Error updating user profile:", error);
					toast.error(error || "Failed to update profile. Please try again.");
				}
			} catch (err) {
				console.error("Unexpected error:", err);
				toast.error("An unexpected error occurred. Please try again.");
			}
		},
	);

	const handleProfilePictureChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (!event.target.files || event.target.files.length === 0) {
			toast.error("You must select an image to upload.");
			return;
		}

		const file = event.target.files[0];
		setSelectedFile(file);

		// Optional: Update the preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setProfilePicture(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	return (
		<Card className="w-full rounded-none border-none">
			<CardHeader>
				<CardTitle>Update Your Profile</CardTitle>
				<CardDescription>
					Make changes to your profile here. Click save when you're done.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={onSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label>Profile Picture</Label>
							<div className="flex items-center space-x-4">
								<Avatar className="w-24 h-24">
									<AvatarImage
										src={profilePicture || undefined}
										alt="Profile picture"
									/>
									<AvatarFallback>
										{`${form.getValues("firstName")[0] ?? ""}${form.getValues("lastName")[0] ?? ""}`.toUpperCase()}
									</AvatarFallback>
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
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input placeholder="John" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input placeholder="Doe" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="john@example.com"
											{...field}
											disabled
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="sex"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Sex</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="flex flex-col space-y-1"
										>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="male" />
												</FormControl>
												<FormLabel className="font-normal">Male</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="female" />
												</FormControl>
												<FormLabel className="font-normal">Female</FormLabel>
											</FormItem>
											<FormItem className="flex items-center space-x-3 space-y-0">
												<FormControl>
													<RadioGroupItem value="other" />
												</FormControl>
												<FormLabel className="font-normal">Other</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Bio</FormLabel>
									<FormControl>
										<Textarea placeholder="Tell us about yourself" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Separator />

						<div>
							<h3 className="text-lg font-medium">Academic Information</h3>
							<p className="text-sm text-muted-foreground">
								Details about your studies.
							</p>
						</div>

						<FormField
							control={form.control}
							name="campus"
							render={({ field }) => (
								<FormItem>
									<FormLabel>College Campus</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a campus" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Object.values(CollegeCampuses).map((campus) => (
												<SelectItem key={campus} value={campus}>
													{campus}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="program"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Program of Studies</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a program" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{/* {programs.map((program) => (
                        <SelectItem key={program} value={program.toLowerCase().replace(' ', '-')}>
                          {program}
                        </SelectItem>
                      ))} */}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="schoolId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>School ID</FormLabel>
									<FormControl>
										<Input placeholder="3012XXXXX" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="isInternational"
							render={({ field }) => (
								<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={(checked) => {
												field.onChange(checked);
												setIsInternational(checked as boolean);
											}}
										/>
									</FormControl>
									<div className="space-y-1 leading-none">
										<FormLabel>International Student</FormLabel>
										<FormDescription>
											Check this if you are an international student.
										</FormDescription>
									</div>
								</FormItem>
							)}
						/>

						{isInternational && (
							<FormField
								control={form.control}
								name="country"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Country of Origin</FormLabel>
										<FormControl>
											<Input placeholder="Enter your country" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						<Separator />

						<div>
							<h3 className="text-lg font-medium">Additional Information</h3>
							<p className="text-sm text-muted-foreground">
								Other details that help us match you better.
							</p>
						</div>

						<FormField
							control={form.control}
							name="interests"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Interests (max 5)</FormLabel>
									<FormControl>
										<InterestsInput
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="bg-muted p-4 rounded-md">
							<p className="text-sm text-muted-foreground">
								Disclaimer: The information provided in this form is optional
								but will help our system to better match you with mentors or
								mentees, depending on your role. Your privacy is important to
								us, and this information will be used solely for the purpose of
								improving your experience on our platform.
							</p>
						</div>

						<Button
							type="submit"
							className="w-full"
							disabled={form.formState.isSubmitting}
						>
							{form.formState.isSubmitting ? (
								<div className="flex gap-1">
									<Loader2
										className="animate-spin text-foreground-muted mt-0.5"
										size={16}
									/>
									<span>Saving...</span>
								</div>
							) : (
								"Save Changes"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
