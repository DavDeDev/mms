"use client";

import { submitMentorAvailabilityAction } from "@/actions/submit-mentor-availability-action";
import { createMentorAvailabilitySchema } from "@/mutations/schema";
import { DayOfWeek } from "@/types/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "../ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import WeekDayPicker from "../week-day-picker";

type FormValues = z.infer<typeof createMentorAvailabilitySchema>;

export default function MentorAvailabilityForm({
	cohortId,
	onSubmitSuccess,
}: {
	cohortId: number;
	onSubmitSuccess?: () => void;
}) {
	const form = useForm<FormValues>({
		resolver: zodResolver(createMentorAvailabilitySchema),
		defaultValues: {
			dayOfWeek: DayOfWeek.monday,
			startTime: "",
			endTime: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		const res = await submitMentorAvailabilityAction(data, cohortId);

		if (res.success) {
			toast.success("Availability added successfully");
			if (onSubmitSuccess) {
				onSubmitSuccess();
			}
		} else {
			console.error("Error submitting availability:", res.error);
			toast.error("Failed to add availability");
		}
	};

	// Update end time when start time changes
	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === "startTime" && value.startTime) {
				const startTime = new Date(`2000-01-01T${value.startTime}`);
				const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
				form.setValue("endTime", endTime.toTimeString().slice(0, 5));
			}
		});
		return () => subscription.unsubscribe();
	}, [form]);

	return (
		<Form {...form}>
			<h1 className="text-3xl font-bold">Select your Availability</h1>
			<FormDescription className="mb-4">
				Please select the day of the week and the start time for your mentoring
				session. Each session is fixed at 1 hour to ensure consistency and
				efficient scheduling.
			</FormDescription>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="dayOfWeek"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Day of Week</FormLabel>
							<FormControl>
								<WeekDayPicker
									value={field.value}
									onChange={field.onChange}
									className="mt-2 w-full justify-center"
									showBusinessDaysOnly
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex space-x-4">
					<FormField
						control={form.control}
						name="startTime"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Start Time</FormLabel>
								<FormControl>
									<Input type="time" step={0} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="endTime"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>End Time</FormLabel>
								<FormControl>
									<Input type="time" step={0} {...field} disabled />
								</FormControl>
								<FormDescription>
									Automatically set to 1 hour after start time
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}