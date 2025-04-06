import { z } from "zod";

export const editProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long").max(50, "Name is too long"),
  email: z.string().email("Invalid email address"),
});
