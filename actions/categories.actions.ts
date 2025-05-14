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
      }
    });

    revalidatePath('/menus/create');

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
      where: branchId ? { branchId } : undefined,
      include: {
        branch: true,
        _count: {
          select: {
            menuCategories: true,
            items: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// Fetch Categories for Select Dropdown
export async function getCategoriesForSelect(branchId: string) {
  try {
    const categories = await prisma.category.findMany({
      where: { branchId },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });
    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories for select:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}

// Fetch Single Category with Details
export async function getCategoryById(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        branch: true,
        menuCategories: {
          include: {
            menu: true,
          },
        },
        items: true,
      },
    });

    if (!category) throw new Error("Category not found");
    return { success: true, category };
  } catch (error) {
    console.error("Error fetching category:", error);
    return { success: false, error: "Category not found" };
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
            menuCategories: true,
            items: true,
          },
        },
      },
    });

    if (!category) {
      return { success: false, error: "Category not found" };
    }

    if (category._count.menuCategories > 0 || category._count.items > 0) {
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

// Fetch Categories by Branch
export async function getCategoriesByBranch(branchId: string) {
  try {
    const categories = await prisma.category.findMany({
      where: { branchId },
      include: {
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
    return categories;
  } catch (error) {
    console.error("Error fetching categories by branch:", error);
    return { success: false, error: "Failed to fetch categories" };
  }
}
