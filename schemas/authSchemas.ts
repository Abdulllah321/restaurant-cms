// schemas/authSchemas.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});


export const signupSchema = z.object({
    email: z.string().email("Please enter a valid email address."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
        .regex(/[0-9]/, "Password must contain at least one number."),
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .refine((val, ctx) => {
            if (val !== ctx.parent.password) {
                return false;
            }
            return true;
        }, {
            message: "Passwords don't match",
        }),
});
