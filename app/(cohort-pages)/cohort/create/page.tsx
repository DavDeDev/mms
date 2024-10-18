"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { createCohortSchema } from "@/mutations/schema";
import { CohortRole, CollegeSemesters } from "@/types/enums";
import { cn } from "@/utils/cn";
import { CalendarIcon, Edit2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

const emailSchema = z.string().email("Please enter a valid email address.");

export default function Page() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const currentYear = new Date().getFullYear();

	const form = useForm<z.infer<typeof createCohortSchema>>({
		resolver: zodResolver(createCohortSchema),
		defaultValues: {
			semester: CollegeSemesters.fall,
			year: currentYear,
			dateRange: {
				from: new Date(currentYear, 8, 1), // September 1st of current year
				to: new Date(currentYear, 11, 31), // December 31st of current year
			},
			coordinator: "",
			members: [],
			image: "",
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
	const onSubmit = async (values: z.infer<typeof createCohortSchema>) => {
		setIsLoading(true);
		// Here you would typically send the form data to your API
		console.log(values);

		// Simulating an API call
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsLoading(false);
		toast.success("Cohort created successfully");
		router.push("/cohorts");
	};

	const addUser = () => {
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

	const removeUser = (index: number) => {
		const updatedUsers = members.filter((_, i) => i !== index);
		setMembers(updatedUsers);
		form.setValue("members", updatedUsers);
	};

	const editUser = (index: number) => {
		setEditingIndex(index);
		setNewMemberEmail(members[index].email);
		setNewMemberRole(members[index].role);
	};

	const updateUser = () => {
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

	return (
		<div className="container mx-auto py-10">
			<h1 className="text-3xl font-bold mb-6">Create New Cohort</h1>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="flex flex-col md:flex-row gap-6">
						<div className="w-full md:w-1/3">
							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Cohort Image</FormLabel>
										<FormControl>
											<div
												className="w-full h-64 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden"
												onClick={() =>
													document.getElementById("image-upload")?.click()
												}
											>
												{imagePreview ? (
													<img
														src={imagePreview}
														alt="Cohort preview"
														className="w-full h-full object-cover"
													/>
												) : (
													<div className="text-center">
														<Upload className="mx-auto h-12 w-12 text-gray-400" />
														<p className="mt-2 text-sm text-gray-500">
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
																field.onChange(result);
																setImagePreview(result);
															};
															reader.readAsDataURL(file);
														}
													}}
												/>
											</div>
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
										<Popover>
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
													/>
												</FormControl>
												<Button
													type="button"
													variant="outline"
													// TODO: Add onClick event to add the coordinator email to the form
													onClick={() =>
														form.setValue(
															"coordinator",
															"pietrocoladavid@gmail.com",
														)
													}
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
								</SelectContent>
							</Select>
							<Button
								type="button"
								onClick={editingIndex !== null ? updateUser : addUser}
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
														onClick={() => editUser(index)}
													>
														<Edit2 className="h-4 w-4" />
													</Button>
													<Button
														type="button"
														variant="ghost"
														size="sm"
														onClick={() => removeUser(index)}
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
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "Creating..." : "Create Cohort"}
					</Button>
				</form>
			</Form>
		</div>
	);
}
