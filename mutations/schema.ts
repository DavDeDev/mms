import { CollegeCampuses, UserSex } from "@/types/enums";
import { z } from "zod";

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
	interests: z.array(z.string()).max(5),
});
