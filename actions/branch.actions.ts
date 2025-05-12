"use server";
import { prisma } from "@/lib/prisma";
import { branchSchema } from "@/schemas/branch.schemas";
import { z } from "zod";

// Create Branch
export async function createBranch(_: unknown, formData: FormData) {
  try {
    const formValues = {
      name: formData.get("name"),
      location: formData.get("location"),
      phoneNumber: formData.get("phoneNumber"),
    };

    const { success, error, data } = branchSchema.safeParse(formValues);

    if (!success) {
      return {
        errors: error.flatten().fieldErrors,
        values: formValues,
      };
    }
    const branch = await prisma.branch.create({
      data: data,
    });

    return branch;
  } catch (error) {
    console.error("Error creating branch:", error);
    return {
      success: false,
      error: error instanceof z.ZodError ? error.errors : "Unknown error",
    };
  }
}

// Fetch All Branches
export async function getAllBranches() {
  try {
    const branches = await prisma.branch.findMany();
    return { success: true, branches };
  } catch (error) {
    console.error("Error fetching branches:", error);
    return { success: false, error: "Failed to fetch branches" };
  }
}

// Fetch Branch Count
export async function getBranchCount() {
  try {
    // Ensure this only runs on the server
    if (typeof window !== "undefined") {
      throw new Error("Prisma should only be used server-side.");
    }

    const count = await prisma.branch.count();
    return { success: true, count };
  } catch (error) {
    console.error("Error fetching branch count:", error);
    return { success: false, error: "Failed to fetch branch count" };
  }
}

// Fetch Single Branch
export async function getBranchById(id: string) {
  try {
    const branch = await prisma.branch.findUnique({
      where: { id: id || undefined },
    });
    if (!branch) throw new Error("Branch not found");
    return { success: true, branch };
  } catch (error) {
    console.error("Error fetching branch:", error);
    return { success: false, error: "Branch not found" };
  }
}

// Update Branch
export async function updateBranch(_: unknown, formData: FormData) {
  try {
    const id = formData.get("id") as string | null;
    if (id === null || id === undefined) {
      throw Error("Id is not define");
      return null;
    }
    const formValues = {
      name: formData.get("name"),
      location: formData.get("location"),
      phoneNumber: formData.get("phoneNumber"),
    };

    const { success, error, data } = branchSchema.safeParse(formValues);

    if (!success) {
      return {
        errors: error.flatten().fieldErrors,
        values: formValues,
      };
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: data,
    });

    return { success: true, branch };
  } catch (error) {
    console.error("Error updating branch:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError ? error.errors : "Failed to update branch",
    };
  }
}

// Delete Branch
export async function deleteBranch(id: string) {
  try {
    await prisma.branch.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting branch:", error);
    return { success: false, error: "Failed to delete branch" };
  }
}
