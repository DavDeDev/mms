"use client";

import { updateUserAction } from "@/actions/update-profile-action";
import { updateUserSchema } from "@/mutations/schema";
import type { Tables } from "@/types";
import { CollegeCampuses, UserSex } from "@/types/enums";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import { Checkbox } from "components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "components/ui/form";
import { Input } from "components/ui/input";
import { RadioGroup, RadioGroupItem } from "components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "components/ui/select";
import { Separator } from "components/ui/separator";
import { Textarea } from "components/ui/textarea";
import { Loader2, Upload, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import InterestsInput from "../interests-input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";

const clientUpdateUserSchema = updateUserSchema.extend({
	avatarUrl: z.union([z.string().url().nullable(), z.instanceof(File)]),
});

export default function UserProfileUpdateForm({
	user,
}: { user: Tables<"users"> }) {
	const supabase = createClient();
	const [isInternational, setIsInternational] = useState(user.is_international);
	const [imagePreview, setImagePreview] = useState<string | null>(
		user.avatar_url,
	);

	const form = useForm<z.infer<typeof clientUpdateUserSchema>>({
		resolver: zodResolver(clientUpdateUserSchema),
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

	const handleAvatarUpload = async (file: File): Promise<string | null> => {
		try {
			const uid = user.id;
			const fileExt = file.name.split(".").pop();
			const filePath = `pfp/${uid}-${Date.now()}.${fileExt}`;
			const { data, error } = await supabase.storage
				.from("avatars")
				.upload(filePath, file);

			if (error) {
				throw new Error("Avatar upload failed");
			}

			const publicUrl = supabase.storage.from("avatars").getPublicUrl(data.path)
				.data.publicUrl;
			return publicUrl;
		} catch (error) {
			toast.error("Failed to upload avatar. Please try again.");
			return null;
		}
	};

	const onSubmit = async (values: z.infer<typeof clientUpdateUserSchema>) => {
		try {
			let avatarUrl: string | null;

			if (values.avatarUrl instanceof File) {
				avatarUrl = await handleAvatarUpload(values.avatarUrl);
			} else {
				avatarUrl = values.avatarUrl;
			}

			const updatedValues = { ...values, avatarUrl };
			const res = await updateUserAction(updatedValues);

			if (res.success) {
				toast.success("Profile updated successfully");
				setImagePreview(avatarUrl);
			} else {
				throw new Error(res.error);
			}
		} catch (error) {
			console.error("Error updating user profile:", error);
			toast.error("Failed to update profile. Please try again.");
		}
	};

	const removeAvatar = () => {
		form.setValue("avatarUrl", null);
		setImagePreview(null);
	};

	return (
		// <Card className="container">
		// 	<CardHeader>
		// 		<CardTitle>Update Your Profile</CardTitle>
		// 		<CardDescription>
		// 			Make changes to your profile here. Click save when you're done.
		// 		</CardDescription>
		// 	</CardHeader>
		// 	<CardContent>
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="flex flex-col md:flex-row gap-6">
					<div className="flex flex-col items-center space-y-2">
						<FormField
							control={form.control}
							name="avatarUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="sr-only">Profile Picture</FormLabel>
									<FormControl>
										<div className="flex flex-col items-center space-y-4">
											<div className="relative">
												<Label
													htmlFor="avatar-upload"
													className="cursor-pointer"
												>
													<Avatar className="w-64 h-64 border-2 border-border hover:border-primary transition-colors ">
														<AvatarImage
															src={imagePreview || undefined}
															alt="Profile picture"
														/>
														<AvatarFallback>
															<Upload className="h-8 w-8 text-muted-foreground" />
														</AvatarFallback>
													</Avatar>
												</Label>
												<Input
													id="avatar-upload"
													type="file"
													accept="image/*"
													className="hidden"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															const reader = new FileReader();
															reader.onloadend = () => {
																// Pass the file object to the react hook form
																field.onChange(file);
																// Use the encoded image as the preview
																if (typeof reader.result === "string") {
																	setImagePreview(reader.result);
																}
															};
															reader.readAsDataURL(file);
														}
													}}
												/>
												{imagePreview && (
													<Button
														type="button"
														size="icon"
														className="absolute top-1 right-1 rounded-full h-8 w-8 border-2 "
														onClick={removeAvatar}
													>
														<X className="h-4 w-4" />
														<span className="sr-only">Remove avatar</span>
													</Button>
												)}
											</div>
										</div>
									</FormControl>
									<FormDescription>
										Click the avatar to upload a new profile picture.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex-1 space-y-4">
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
											className="flex space-x-4"
										>
											{Object.values(UserSex).map((sex) => (
												<FormItem
													key={sex}
													className="flex items-center space-x-2"
												>
													<FormControl>
														<RadioGroupItem value={sex} />
													</FormControl>
													<FormLabel className="font-normal">{sex}</FormLabel>
												</FormItem>
											))}
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
							<Select onValueChange={field.onChange} defaultValue={field.value}>
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
								<InterestsInput value={field.value} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="bg-muted p-4 rounded-md">
					<p className="text-sm text-muted-foreground">
						Disclaimer: The information provided in this form is optional but
						will help our system to better match you with mentors or mentees,
						depending on your role. Your privacy is important to us, and this
						information will be used solely for the purpose of improving your
						experience on our platform.
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
		// 	</CardContent>
		// </Card>
	);
}
