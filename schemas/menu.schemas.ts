import { z } from "zod";

export const menuItemSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().positive(),
    imageUrl: z.string().url().optional(),
});

export const categorySchema = z.object({
    name: z.string().min(1),
    items: z.array(menuItemSchema).optional(), // Nested MenuItems
});


export const menuSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    branchId: z.string().min(1),
    categories: z.array(categorySchema).optional(), // Nested Categories
});

