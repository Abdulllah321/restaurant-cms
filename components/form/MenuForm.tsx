"use client";
import React, { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createMenu } from "@/actions/menu.actions";
import Categories from "./components/Categories";
import { ReusableDialog } from "../common/reuseable-dialog";
import CategoryForm from "./CategoryForm";
import { fetchSelectedBranch } from "@/data/constants";

export type MenuInput = {
  name: string;
  description?: string;
  branchId: string;
  categories?: string[];
};

export type MenuItemInput = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

interface MenuFormProps {
  selectedMenu?: MenuInput | null;
}

const MenuForm: React.FC<MenuFormProps> = ({ selectedMenu }) => {
  const action = selectedMenu ? createMenu : createMenu;
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedMenu?.categories || []
  );
  const [state, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => {
      formData.set("categories", JSON.stringify(selectedCategories));
      return await action(_, formData);
    },
    null
  );
  const [categoryFormDialog, setCategoryFormDialog] = useState(false);
  const branchId = fetchSelectedBranch()!.id;

  const getDefaultValue = (field: keyof MenuInput) => {
    return selectedMenu?.[field] ?? "";
  };

  const getErrorMessage = (field: keyof MenuInput) => {
    return state && "errors" in state
      ? (state.errors as Record<keyof MenuInput, string | undefined>)?.[field]
      : "";
  };

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newCategories = selectedCategories?.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...(selectedCategories || []), categoryId];
      return { ...prev, newCategories };
    });
  };

  const handleAddCategory = () => {};

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label>Name</Label>
        <Input name="name" defaultValue={getDefaultValue("name") as string} />
        {getErrorMessage("name") && (
          <p className="text-destructive">{getErrorMessage("name")}</p>
        )}
      </div>
      <Input type="hidden" value={branchId} />
      <div>
        <Label>Description</Label>
        <Textarea
          name="description"
          defaultValue={getDefaultValue("description") as string}
        />
      </div>

      <Categories
        handleToggleCategory={handleToggleCategory}
        selectedCategories={selectedCategories}
        handleAddCategory={() => setCategoryFormDialog(true)}
      />

      <ReusableDialog
        title="Create new Category"
        isOpen={categoryFormDialog}
        setIsOpen={setCategoryFormDialog}
      >
        <CategoryForm onAdd={handleAddCategory} />
      </ReusableDialog>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? selectedMenu
            ? "Updating..."
            : "Creating..."
          : selectedMenu
          ? "Update Menu"
          : "Create Menu"}
      </Button>
    </form>
  );
};

export default MenuForm;
