import { prisma } from "@/lib/prisma";
import { menuSchema } from "@/schemas/menu.schemas";

export async function createMenu(_: unknown, formData: FormData) {
  try {
    const raw = {
      name: formData.get("name"),
      description: formData.get("description") || undefined,
      categories: JSON.parse((formData.get("categories") as string) || "[]"),
      branchId: formData.get("branchId") as string,
    };

    const parsed = menuSchema.safeParse(raw);
    if (!parsed.success || !parsed.data) {
      throw new Error("Invalid data");
    }

    const { name, description, categories, branchId } = parsed.data;

    const newMenu = await prisma.menu.create({
      data: {
        name,
        description,
        branch: { connect: { id: branchId } },
      },
    });

    if (categories && categories.length > 0) {
      await prisma.menuCategory.createMany({
        data: categories.map((categoryId: string) => ({
          menuId: newMenu.id,
          categoryId,
        })),
        skipDuplicates: true,
      });
    }

    return { message: "Menu created successfully", menu: newMenu };
  } catch (error) {
    throw new Error(
      "Error creating menu: " +
        (error instanceof Error ? error.message : "Unknown error")
    );
  }
}
