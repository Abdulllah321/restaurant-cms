"use server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/schemas/menu.schemas";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Create Category
export async function createCategory(_: unknown, formData: FormData) {
  try {
    const formValues = {
      name: formData.get("name"),
      branchId: formData.get("branchId"),
    };

    const { success, error, data } = categorySchema.safeParse(formValues);

    if (!success) {
      return {
        errors: error.flatten().fieldErrors,
        values: formValues,
      };
    }

    const category = await prisma.category.create({
      data: {
        name: data.name,
        branchId: data.branchId,
      },
      include: {
        items: true,
      },
    });

    revalidatePath("/menus/create");

    return { success: true, category };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error: error instanceof z.ZodError ? error.errors : "Unknown error",
    };
  }
}

// Fetch All Categories (with branch info)
export async function getCategories(branchId?: string) {
  try {
    const categories = await prisma.category.findMany({
      where: { branchId },
      include: {
        items: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// Update Category
export async function updateCategory(_: unknown, formData: FormData) {
  try {
    const id = formData.get("id") as string;
    if (!id) {
      throw new Error("ID is not defined");
    }

    const formValues = {
      name: formData.get("name"),
      branchId: formData.get("branchId"),
    };

    const { success, error, data } = categorySchema.safeParse(formValues);

    if (!success) {
      return {
        errors: error.flatten().fieldErrors,
        values: formValues,
      };
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        branchId: data.branchId,
      },
      include: {
        branch: true,
      },
    });

    return { success: true, category };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.errors
          : "Failed to update category",
    };
  }
}

// Delete Category (with safety checks)
export async function deleteCategory(id: string) {
  try {
    // Check if category has associated menu categories or items
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    if (category._count.items > 0) {
      return {
        success: false,
        error:
          "Cannot delete category with associated menu categories or items",
      };
    }

    await prisma.category.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
