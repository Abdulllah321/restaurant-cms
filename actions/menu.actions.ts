"use server";
import { MenuInput } from "@/components/form/MenuForm";
import { prisma } from "@/lib/prisma";
import { menuItemSchema, menuSchema } from "@/schemas/menu.schemas";
import { uploadImage } from "./upload.image";

// Create Menu
export async function createMenu(data: MenuInput) {
  try {
    console.log(data)
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

// Create Menu Item
export async function createMenuItem(_: unknown, formData: FormData) {
  try {
    // Extract raw form data
    const raw = {
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      price: parseFloat(formData.get("price") as string) || 0,
      image: (formData.get("image") as File) || undefined,
      branchId: formData.get("branchId") as string,
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
    try {
      if (data.image) {
        imageUrl = await uploadImage(data.image);
      }
    } catch (uploadError) {
      console.error("[IMAGE_UPLOAD_ERROR]", uploadError);
      return {
        error: "Failed to upload image. Please try again later.",
        values: raw,
      };
    }

    // Create menu item
    const { name, description, price, branchId, categoryId } = data;
    const newMenuItem = await prisma.menuItem.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        category: { connect: { id: categoryId } },
        branch: { connect: { id: branchId } },
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
    if (data.image) {
      imageUrl = await uploadImage(data.image);
    }

    const { name, description, price } = data;

    const updatedMenuItem = await prisma.menuItem.update({
      where: { id: itemId },
      data: {
        name,
        description,
        price,
        imageUrl,
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

// Fetch Menu Items
export const getMenuItems = async () => {
  try {
    const menuItems = await prisma.menuItem.findMany();
    return menuItems;
  } catch (err) {
    console.error(err);
    throw new Error("Error fetching menu items");
  }
};
