"use client";
import { createMentorAvailabilitySchema } from "@/mutations/schema";
import { DayOfWeek } from "@/types/enums";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
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

export default function MentorAvailabilityForm() {
	const form = useForm<FormValues>({
		resolver: zodResolver(createMentorAvailabilitySchema),
		defaultValues: {
			dayOfWeek: DayOfWeek.monday,
			startTime: "",
			endTime: "",
		},
	});

	const onSubmit = (data: FormValues) => {
		console.log(data);
		// Handle form submission here
	};

	return (
		<Form {...form}>
			<h1 className="text-3xl font-bold">Select your Availability</h1>
			<FormDescription>
				Please select the day of the week and the time range during which you
				are available to mentor.
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
									<Input type="time" step={0} {...field} />
								</FormControl>
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
