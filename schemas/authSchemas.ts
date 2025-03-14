// schemas/authSchemas.ts
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceed 20 characters"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceed 20 characters")
    .refine((val, ctx) => val === ctx.parent.password, {
      message: "Passwords don't match",
    }),
});
