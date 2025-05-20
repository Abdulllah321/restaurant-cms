"use server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/schemas/menu.schemas";
import {  revalidateTag } from "next/cache";
import { z } from "zod";
import { uploadImage } from "./upload.image";

// Create Category
export async function createCategory(_: unknown, formData: FormData) {
  try {
      const formValues = {
      name: (formData.get("name") as string)?.trim(),
      branchId: (formData.get("branchId") as string)?.trim(),
      image: (formData.get("image") as File) || undefined,
    };

    const { success, error, data } = categorySchema.safeParse(formValues);

    if (!success) {
      return {
        errors: error.flatten().fieldErrors,
        values: formValues,
      };
    }
    let imageUrl = undefined;
    try {
      if (data.image) {
        imageUrl = (await uploadImage(data.image)).publicUrl;
      }
    } catch (uploadError) {
      console.error("[IMAGE_UPLOAD_ERROR]", uploadError);
      return {
        error: "Failed to upload image. Please try again later.",
        values: formValues,
      };
    }
    const category = await prisma.category.create({
      data: {
        name: data.name,
        branchId: data.branchId,
        imageUrl,
      },
      include: {
        items: true,
      },
    });

    revalidateTag(`branch-${data.branchId}-categories`);

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
export async function getCategories(branchId?: string, query?: string) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        branchId,
        name: query
          ? {
              contains: query,
              mode: "insensitive",
            }
          : undefined,
      },
      include: {
        items: true,
        menus: {
          select: {
            id: true,
            name: true,
          },
        },
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
      name: (formData.get("name") as string)?.trim(),
      branchId: (formData.get("branchId") as string)?.trim(),
      image: (formData.get("image") as File) || undefined,
    };

    const { success, error, data } = categorySchema.safeParse(formValues);

    if (!success) {
      return {
        errors: error.flatten().fieldErrors,
        values: formValues,
      };
    }

       let imageUrl = undefined;
    try {
      if (data.image) {
        imageUrl = (await uploadImage(data.image)).publicUrl;
      }
    } catch (uploadError) {
      console.error("[IMAGE_UPLOAD_ERROR]", uploadError);
      return {
        error: "Failed to upload image. Please try again later.",
        values: formValues,
      };
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        branchId: data.branchId,
        imageUrl
      },
      include: {
        branch: true,
      },
    });
    revalidateTag(`branch-${data.branchId}-categories`);

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
        revalidateTag(`branch-${category.branchId}-categories`);


    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}
