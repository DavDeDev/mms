import { UserSex, CollegeCampuses } from "@/types/enums";
import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional(),
  bio: z.string().optional(),
  sex: z.nativeEnum(UserSex),
  campus: z.nativeEnum(CollegeCampuses),
  program: z.string().optional(),
  schoolId: z.coerce.number(),
  isInternational: z.boolean().default(false),
  country: z.string().optional(),
  interests:z.union([
    z.string(),
    z.array(z.string())
  ]).optional()
})