"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createCohortAction } from "@/actions/create-cohort-action";
import { createCohortSchema } from "@/mutations/schema";
import { CohortRole, CollegeSemesters } from "@/types/enums";
import { cn } from "@/utils/cn";
import { createClient } from "@/utils/supabase/client";
import { Button } from "components/ui/button";
import { Calendar } from "components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { ScrollArea } from "components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "components/ui/table";
import { CalendarIcon, Edit2, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const emailSchema = z.string().email("Please enter a valid email address.");
const clientCreateCohortSchema = createCohortSchema.extend({
	avatarUrl: z
		.union([z.string().url().nullable(), z.instanceof(File)])
		.optional(),
});

export default function CreateCohortForm({
	userEmail,
	onSubmitSuccess,
}: {
	userEmail: string;
	onSubmitSuccess?: () => void;
}) {
	const router = useRouter();
	const supabase = createClient();
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const currentYear = new Date().getFullYear();

	const form = useForm<z.infer<typeof clientCreateCohortSchema>>({
		resolver: zodResolver(clientCreateCohortSchema),
		defaultValues: {
			semester: CollegeSemesters.fall,
			year: currentYear,
			dateRange: {
				from: new Date(currentYear, 8, 1), // September 1st of current year
				to: new Date(currentYear, 11, 31), // December 31st of current year
			},
			coordinator: "",
			members: [],
		},
	});

	const [members, setMembers] = useState<{ email: string; role: CohortRole }[]>(
		[],
	);
	const [newMemberEmail, setNewMemberEmail] = useState("");
	const [newMemberRole, setNewMemberRole] = useState<CohortRole>(
		CohortRole.mentee,
	);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [emailError, setEmailError] = useState<string | null>(null);

	const validateEmail = (email: string) => {
		try {
			emailSchema.parse(email);
			setEmailError(null);
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				setEmailError(error.errors[0].message);
			}
			return false;
		}
	};
	const onSubmit = async (values: z.infer<typeof clientCreateCohortSchema>) => {
		let avatarUrl: string | null; // Start with the existing avatar URL

		if (values.avatarUrl instanceof File) {
			const uid = uuidv4();
			const fileExt = values.avatarUrl.name.split(".").pop();
			const filePath = `cohort/${uid}-${Math.random()}.${fileExt}`;

			const { data, error } = await supabase.storage
				.from("avatars")
				.upload(filePath, values.avatarUrl);

			if (error) {
				toast.error("Failed to upload cohort image. Please try again.");
				return;
			}

			avatarUrl = supabase.storage.from("avatars").getPublicUrl(data.path)
				.data.publicUrl;
		} else {
			avatarUrl = values.avatarUrl ?? null;
		}

		const response = await createCohortAction({
			...values,
			avatarUrl,
		});

		// Handle the response from the server action
		if (response.success) {
			// Access properties safely when success is true
			const { data } = response; // Assuming data might be useful here
			toast.success("Cohort created successfully!"); // Show success notification
			// Optionally, redirect or update UI after successful cohort creation
			router.push("/dashboard/cohorts"); // Redirect to the cohorts page
			if (onSubmitSuccess) {
				onSubmitSuccess();
			}
		} else {
			// Access properties safely when success is false
			const { error } = response; // Access the error message
			toast.error(`Failed to create cohort: ${error}`); // Show error message
		}
	};

	const addMember = () => {
		if (validateEmail(newMemberEmail) && newMemberRole) {
			const newUser = { email: newMemberEmail, role: newMemberRole };
			setMembers([...members, newUser]);
			form.setValue("members", [...members, newUser]);
			setNewMemberEmail("");
			setNewMemberRole(CohortRole.mentee);
			toast.success("Member added successfully");
		} else {
			toast.error("Please enter a valid email address");
		}
	};

	const removeMember = (index: number) => {
		const updatedUsers = members.filter((_, i) => i !== index);
		setMembers(updatedUsers);
		form.setValue("members", updatedUsers);
	};

	const editMember = (index: number) => {
		setEditingIndex(index);
		setNewMemberEmail(members[index].email);
		setNewMemberRole(members[index].role);
	};

	const updateMember = () => {
		if (
			editingIndex !== null &&
			validateEmail(newMemberEmail) &&
			newMemberRole
		) {
			const updatedUsers = [...members];
			updatedUsers[editingIndex] = {
				email: newMemberEmail,
				role: newMemberRole,
			};
			setMembers(updatedUsers);
			form.setValue("members", updatedUsers);
			setNewMemberEmail("");
			setNewMemberRole(CohortRole.mentee);
			setEditingIndex(null);
			toast.success("Member updated successfully");
		} else {
			toast.error("Please enter a valid email address");
		}
	};

	const addCoordinator = (email: string) => {
		// Remove any existing coordinator from members
		const updatedMembers = members.filter(
			(member) => member.role !== CohortRole.coordinator,
		);

		// Add the new coordinator to members if not already present
		if (!updatedMembers.some((member) => member.email === email)) {
			updatedMembers.push({ email, role: CohortRole.coordinator });
		}

		setMembers(updatedMembers);
		form.setValue("members", updatedMembers);
		form.setValue("coordinator", email);
	};

	return (
		<div className="">
			<h1 className="text-3xl font-bold mb-6">Create New Cohort</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="flex flex-col md:flex-row gap-6">
						<div className="w-full md:w-1/3">
							<FormField
								control={form.control}
								name="avatarUrl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cohort Image</FormLabel>
										<FormControl>
											<Button
												variant={"outline"}
												className="w-full h-64 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden"
												onClick={() =>
													document.getElementById("image-upload")?.click()
												}
												onKeyDown={(e) => {
													if (e.key === "Enter" || e.key === " ") {
														e.preventDefault(); // Prevents any scrolling that might happen when pressing space
														document.getElementById("image-upload")?.click();
													}
												}}
												tabIndex={0} // Makes the div focusable
												type="button"
											>
												{imagePreview ? (
													<img
														src={imagePreview}
														alt="Cohort preview"
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="text-center">
														<Upload className="mx-auto h-12 w-12 text-muted" />
														<p className="mt-2 text-sm text-muted">
															Click to upload image
														</p>
													</div>
												)}
												<Input
													id="image-upload"
													type="file"
													accept="image/*"
													className="hidden"
													onChange={(e) => {
														const file = e.target.files?.[0];
														if (file) {
															const reader = new FileReader();
															reader.onloadend = () => {
																const result = reader.result as string;
																field.onChange(file);
																setImagePreview(result);
															};
															reader.readAsDataURL(file);
														}
													}}
												/>
											</Button>
										</FormControl>
										<FormDescription>
											Upload an image for the cohort (optional).
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full md:w-2/3 space-y-6">
							<FormField
								control={form.control}
								name="dateRange"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date Range</FormLabel>
										<Popover modal>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-full justify-start text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{field.value?.from ? (
															field.value.to ? (
																<>
																	{format(field.value.from, "LLL dd, y")} -{" "}
																	{format(field.value.to, "LLL dd, y")}
																</>
															) : (
																format(field.value.from, "LLL dd, y")
															)
														) : (
															<span>Pick a date range</span>
														)}
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													initialFocus
													mode="range"
													defaultMonth={field.value?.from}
													selected={field.value}
													onSelect={(newValue) => {
														if (newValue?.from) {
															field.onChange({
																from: newValue.from,
																to: newValue.to || newValue.from,
															});
														}
													}}
													numberOfMonths={2}
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="semester"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Semester</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a semester" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="fall">Fall</SelectItem>
													<SelectItem value="winter">Winter</SelectItem>
													<SelectItem value="summer">Summer</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="year"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Year</FormLabel>
											<FormControl>
												<Input
													type="number"
													{...field}
													onChange={(e) =>
														field.onChange(Number.parseInt(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex items-center gap-4">
								<FormField
									control={form.control}
									name="coordinator"
									render={({ field }) => (
										<FormItem className="flex-grow">
											<FormLabel>Coordinator</FormLabel>
											<div className="flex gap-2">
												<FormControl>
													<Input
														type="email"
														placeholder="coordinator@example.com"
														{...field}
														onChange={(e) => {
															field.onChange(e);
															addCoordinator(e.target.value);
														}}
													/>
												</FormControl>
												<Button
													type="button"
													variant="outline"
													onClick={() => addCoordinator(userEmail)}
												>
													Add Me
												</Button>
											</div>
											<FormDescription>
												Enter the email of the coordinator or select yourself.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>
					<div>
						<h3 className="text-lg font-semibold mb-2">Add Members</h3>
						<div className="flex space-x-2 mb-4">
							<Input
								type="email"
								placeholder="user@example.com"
								value={newMemberEmail}
								onChange={(e) => setNewMemberEmail(e.target.value)}
								className="flex-grow"
							/>
							<Select
								value={newMemberRole}
								onValueChange={(value: CohortRole) => setNewMemberRole(value)}
							>
								<SelectTrigger className="w-[120px]">
									<SelectValue placeholder="Role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={CohortRole.mentor}>Mentor</SelectItem>
									<SelectItem value={CohortRole.mentee}>Mentee</SelectItem>
									<SelectItem value={CohortRole.admin}>Admin</SelectItem>
									<SelectItem value={CohortRole.coordinator}>
										Coordinator
									</SelectItem>
								</SelectContent>
							</Select>
							<Button
								type="button"
								onClick={editingIndex !== null ? updateMember : addMember}
							>
								{editingIndex !== null ? "Update" : "Add"}
							</Button>
						</div>
						{emailError && (
							<p className="text-red-500 text-sm mb-2">{emailError}</p>
						)}
						<ScrollArea className="h-[200px] rounded-md border">
							<Table className="table-fixed">
								<TableHeader>
									<TableRow>
										<TableHead className="w-1/2">Email</TableHead>
										<TableHead className="w-1/4">Role</TableHead>
										<TableHead className="w-1/4">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{members.map((user, index) => (
										<TableRow key={index}>
											<TableCell className="font-medium">
												<span title={user.email}>{user.email}</span>
											</TableCell>
											<TableCell className="capitalize">{user.role}</TableCell>
											<TableCell>
												<div className="flex space-x-2">
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => editMember(index)}
													>
														<Edit2 className="h-4 w-4" />
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => removeMember(index)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</ScrollArea>
					</div>
					<Button type="submit" disabled={form.formState.isSubmitting}>
						{form.formState.isSubmitting ? (
							<div className="flex gap-1">
								<Loader2
									className="animate-spin text-foreground-muted mt-0.5"
									size={16}
								/>
								<span>Creating...</span>
							</div>
						) : (
							"Create Cohort"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
