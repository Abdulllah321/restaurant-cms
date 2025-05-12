import { z } from "zod";

export const branchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  location: z.string().min(5, 'Location must be at least 5 characters long.'),
  phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format.')
});