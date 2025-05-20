"use server";
import { MenuInput } from "@/components/form/MenuForm";
import { prisma } from "@/lib/prisma";
import { menuItemSchema, menuSchema } from "@/schemas/menu.schemas";
import { uploadImage } from "./upload.image";
import { revalidatePath } from "next/cache";

// Get All Menus
export async function getMenus() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        branch: true,
        categories: true,
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return menus;
  } catch (error) {
    throw new Error(
      "Error fetching menus: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

// Get Menu By ID
export async function getMenuById(menuId: string) {
  try {
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
      include: {
        branch: true,
        categories: true,
        items: true,
      },
    });

    if (!menu) {
      throw new Error("Menu not found");
    }

    return { message: "Menu fetched successfully", menu };
  } catch (error) {
    throw new Error(
      "Error fetching menu: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

// Create Menu
export async function createMenu(data: MenuInput) {
  try {
    console.log(data);
    const parsed = menuSchema.safeParse(data);
    if (!parsed.success || !parsed.data) {
      throw new Error("Invalid data");
    }

    const { name, description, categories, branchId, items } = parsed.data;

    const newMenu = await prisma.menu.create({
      data: {
        name,
        description,
        branch: { connect: { id: branchId } },
        categories: {
          connect: categories?.map((catId: string) => ({ id: catId })),
        },
        items: {
          connect: items?.map((item: string) => ({ id: item })),
        },
      },
    });

    return { message: "Menu created successfully", menu: newMenu };
  } catch (error) {
    throw new Error(
      "Error creating menu: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

// Delete Menu
export async function deleteMenu(menuId: string) {
  try {
    const deleted = await prisma.menu.delete({
      where: { id: menuId },
    });

    revalidatePath("/menus");
    return { message: "Menu deleted successfully", menu: deleted };
  } catch (error) {
    throw new Error(
      "Error deleting menu: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

// Update Menu
export async function updateMenu(menuId: string, data: MenuInput) {
  try {
    const parsed = menuSchema.safeParse(data);
    if (!parsed.success || !parsed.data) {
      throw new Error("Invalid data");
    }

    const { name, description, categories, branchId, items } = parsed.data;

    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data: {
        name,
        description,
        branch: { connect: { id: branchId } },
        categories: {
          set: [], // Clear existing
          connect: categories?.map((catId: string) => ({ id: catId })),
        },
        items: {
          set: [], // Clear existing
          connect: items?.map((item: string) => ({ id: item })),
        },
      },
    });

    return { message: "Menu updated successfully", menu: updatedMenu };
  } catch (error) {
    throw new Error(
      "Error updating menu: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

// Create Menu Item
export async function createMenuItem(_: unknown, formData: FormData) {
  try {
    // Extract raw form data
    const raw = {
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      price: parseFloat(formData.get("price") as string) || 0,
      image: (formData.get("image") as File) || undefined,
      categoryId: formData.get("categoryId") as string,
    };

    // Validate form data
    const { success, error, data } = menuItemSchema.safeParse(raw);
    if (!success || !data) {
      return {
        errors: error.flatten().fieldErrors,
        values: raw,
      };
    }

    // Upload image if available
    let imageUrl = undefined;
    let blurDataUrl = undefined;
    if (data.image) {
      const image = await uploadImage(data.image);
      imageUrl = image.publicUrl;
      blurDataUrl = image.blurhash;
    }

    // Create menu item
    const { name, description, price, categoryId } = data;
    const newMenuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        blurDataUrl,
        category: { connect: { id: categoryId } },
      },
    });

    
    return {
      message: "Menu item created successfully",
      menuItem: newMenuItem,
    };
  } catch (error) {
    console.error("[CREATE_MENU_ITEM_ERROR]", error);
    return {
      error:
        "Something went wrong while creating the menu item. Please try again later.",
    };
  }
}

// Update Menu Item
export async function updateMenuItem(_: unknown, formData: FormData) {
  try {
    const itemId = formData.get("id") as string;
    const raw = {
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      price: parseFloat(formData.get("price") as string) || 0,
      imageUrl: formData.get("imageUrl") || undefined,
    };

    const { success, error, data } = menuItemSchema.safeParse(raw);

    if (!success || !data) {
      return {
        errors: error.flatten().fieldErrors,
        values: raw,
      };
    }

    let imageUrl = undefined;
    let blurDataUrl = undefined;
    if (data.image) {
      const image = await uploadImage(data.image);
      imageUrl = image.publicUrl;
      blurDataUrl = image.blurhash;
    }

    const { name, description, price } = data;

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        name,
        description,
        price,
        imageUrl,
        blurDataUrl,
      },
    });

    return {
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem,
    };
  } catch (error) {
    throw new Error(
      "Error updating menu item: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

// Delete Menu Item
export async function deleteMenuItem(itemId: string) {
  try {
    await prisma.menuItem.delete({
      where: { id: itemId },
    });

    return { message: "Menu item deleted successfully" };
  } catch (error) {
    throw new Error(
      "Error deleting menu item: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}

// Fetch Menu Items with optional search query
export const getMenuItems = async (query?: string) => {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: query
        ? {
            name: {
              contains: query,
              mode: "insensitive", // case-insensitive search
            },
          }
        : undefined,
      include: {
        category: true,
      },
    });

    return menuItems;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching menu items");
  }
};
