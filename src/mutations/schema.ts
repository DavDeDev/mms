import {
	CohortRole,
	CollegeCampuses,
	CollegeSemesters,
	UserSex,
} from "@/types/enums";
import { z } from "zod";

const passwordSchema = z
	.string()
	.min(8, { message: "Minimum 8 characters." })
	.max(20, { message: "Maximum 20 Characters" })
	.refine((password) => /[A-Z]/.test(password), {
		message: "Password must contain at least one uppercase letter.",
	})
	.refine((password) => /[a-z]/.test(password), {
		message: "Password must contain at least one lowercase letter.",
	})
	.refine((password) => /[0-9]/.test(password), {
		message: "Password must contain at least one number.",
	})
	.refine((password) => /[!@#$%^&*]/.test(password), {
		message:
			"Password must contain at least one special character (e.g., !@#$%^&*).",
	});

export const registerUserSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.string().email(),
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const loginUserSchema = z.object({
	email: z.string().email(),
	password: passwordSchema,
});

const MAX_INTEREST_LENGTH = 30;

export const updateUserSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email(),
	bio: z.string().max(250, "Max 250 characters").optional(),
	sex: z.nativeEnum(UserSex).optional(),
	campus: z.nativeEnum(CollegeCampuses).optional(),
	program: z.string().optional(),
	schoolId: z.coerce.number(),
	isInternational: z.boolean().default(false),
	country: z.string().optional(),
	interests: z
		.array(
			z
				.string()
				.max(
					MAX_INTEREST_LENGTH,
					`Interest must be ${MAX_INTEREST_LENGTH} characters or less`,
				),
		)
		.max(5, "Maximum 5 interests allowed"),
	avatarUrl: z.string().url().nullable(),
});

export const createCohortSchema = z.object({
	semester: z.nativeEnum(CollegeSemesters),
	year: z.number().int().min(2023).max(2100),
	dateRange: z.object({
		from: z.date(),
		to: z.date(),
	}),
	coordinator: z.string().email(),
	members: z.array(
		z.object({
			email: z.string().email(),
			role: z.nativeEnum(CohortRole),
		}),
	),
	avatarUrl: z.string().url().nullable(),
});
