import { BranchSwitcher } from "@/components/common/branch-switcher";
import { BRANCH_LOCAL_STORAGE_KEY } from "@/data/constants";
import { prisma } from "@/lib/prisma"; // Update path as needed
import { menuSchema } from "@/schemas/menu.schemas";
import { z } from "zod";

// CREATE Menu with categories and items
export async function createMenu(_: unknown, formData: FormData) {
    try {
        const raw = {
            name: formData.get("name"),
            description: formData.get("description") || undefined,
            categories: JSON.parse(formData.get("categories") as string || "[]"),
        };

        const parsed = menuSchema.safeParse(raw);

        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors,
                values: raw,
            };
        }

        const { name, description, categories } = parsed.data;

        const selectedBranch = localStorage.getItem(BRANCH_LOCAL_STORAGE_KEY);
        const parsedBranch = JSON.parse(selectedBranch!) as BranchSwitcher;

        const branchId = parsedBranch.id;

        const menu = await prisma.menu.create({
            data: {
                name,
                description,
                categories: {
                    create: categories?.map((cat) => ({
                        name: cat.name,
                        branchId,
                        items: {
                            create: cat.items?.map((item) => ({
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                imageUrl: item.imageUrl,
                                branchId,
                            })) || [],
                        },
                    })) || [],
                },
            },
            include: {
                categories: {
                    include: {
                        items: true,
                    },
                },
            },
        });

        return { success: true, data: menu };
    } catch (error) {
        console.error("Create menu error:", error);
        return { success: false, error: "Internal server error" };
    }
}
