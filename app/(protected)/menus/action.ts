'use server';

import prisma from '@/lib/prisma'; // Adjust path to your Prisma instance
import { revalidatePath } from 'next/cache'; // optional, for cache revalidation
import { menuSchema } from './schemas';
import { redirect } from 'next/navigation';

// CREATE
export async function createMenu(_: unknown, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;

    const validation = menuSchema.safeParse({ name, description });

    if (!validation.success) {
        return { errors: validation.error.flatten().fieldErrors };
    }

    // Simulate saving to a database
    const newMenu = {
        name,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    await prisma.menu.create({ data: newMenu })

    // Redirect to the new menu page
    redirect(`/menus`);
}

// READ
export async function getMenus() {
    try {
        const menus = await prisma.menu.findMany({
            include: {
                categories: true,
                items: true,
                Branch: true,
            },
        });
        return menus;
    } catch (error) {
        console.error('Get menus error:', error);
        throw error;
    }
}

// UPDATE
export async function updateMenu(id: string, data: { name?: string; description?: string }) {
    try {
        const updatedMenu = await prisma.menu.update({
            where: { id },
            data,
        });
        revalidatePath('/menus'); // optional
        return updatedMenu;
    } catch (error) {
        console.error('Update menu error:', error);
        throw error;
    }
}

// DELETE
export async function deleteMenu(id: string) {
    try {
        const deletedMenu = await prisma.menu.delete({
            where: { id },
        });
        revalidatePath('/menus'); // optional
        return deletedMenu;
    } catch (error) {
        console.error('Delete menu error:', error);
        throw error;
    }
}
