import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  image: z.instanceof(File).optional(),
  categoryId: z.string(),
  branchId: z.string(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  branchId: z.string().min(1, "Branch is required"),
});

export const menuSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  branchId: z.string().min(1),
  categories: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
});
