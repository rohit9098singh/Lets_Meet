import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(2, "Name is required"),
  email: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["male", "female", "other"], { message: "Select a valid gender" }),
});

export {registerSchema,loginSchema}