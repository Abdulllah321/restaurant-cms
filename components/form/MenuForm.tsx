"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createMenu } from "@/actions/menu.actions";
import Categories from "./components/Categories";
import { ReusableDialog } from "../common/reuseable-dialog";
import CategoryForm from "./CategoryForm";
import { fetchSelectedBranch } from "@/data/constants";
import MultiSelectWidget from "../common/CustomMultiSelect";
import MenuItemForm from "./MenuItemForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Option } from "../ui/multiselect";

export type MenuInput = {
  name: string;
  description?: string;
  branchId: string;
  categories?: string[];
  items?: string[];
};

const menuSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  branchId: z.string().nonempty(),
  categories: z.array(z.string()).optional(),
});

interface MenuFormProps {
  selectedMenu?: MenuInput | null;
}

const MenuForm: React.FC<MenuFormProps> = ({ selectedMenu }) => {
  const [branchId, setBranchId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedMenu?.categories || []
  );
  const [selectedItemsByCategory, setSelectedItemsByCategory] = useState<
    Record<string, Option[]>
  >({});
  const [categoryFormDialog, setCategoryFormDialog] = useState(false);
  const [menuItemFormDialog, setMenuItemFormDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const selectedBranch = fetchSelectedBranch();
    if (!selectedBranch) {
      toast.error("Invalid branch data", {
        description: "Please select a branch again",
      });
      return;
    }

    const { id } = selectedBranch;
    setBranchId(id);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MenuInput>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      name: selectedMenu?.name || "",
      description: selectedMenu?.description || "",
      branchId: branchId ?? undefined,
      categories: selectedMenu?.categories || [],
    },
  });
  useEffect(() => {
    if (branchId) {
      setValue("branchId", branchId); // Set the branchId in the form when available
    }
  }, [branchId]);

  const onSubmit = async (data: MenuInput) => {
    try {
      console.log("Form data before submission:", data);
      data.categories = selectedCategories;
      data.items = Object.values(selectedItemsByCategory).flatMap((items) =>
        items.map((item) => item.value)
      );
      await createMenu(data);
      console.log("Successfully submitted:", data);
    } catch (err) {
      console.log("Error during form submission:", err);
    }
  };

  const handleAddCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
    setSelectedCategories((prev) => [...prev, category.id]);
    setCategoryFormDialog(false);
  };

  const handleNewItemAdded = (newItem: MenuItem) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => {
        if (category.id === newItem.categoryId) {
          // Ensure the items array exists
          const items = category.items || [];
          return {
            ...category,
            items: [...items, newItem],
            _count: {
              items: (category._count?.items ?? 0) + 1,
            },
          };
        }
        return category;
      })
    );
    setSelectedCategoryId(null);
    setMenuItemFormDialog(false);
  };

  const handleNewItem = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setMenuItemFormDialog(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-destructive">{errors.name.message}</p>
          )}
        </div>

        <Input type="hidden" value={branchId!} {...register("branchId")} />

        <div>
          <Label>Description</Label>
          <Textarea {...register("description")} />
        </div>

        <Categories
          handleToggleCategory={(categoryId) => {
            setSelectedCategories((prev) =>
              prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
            );
          }}
          selectedCategories={selectedCategories}
          categories={categories}
          setCategories={setCategories}
          handleAddCategory={() => setCategoryFormDialog(true)}
        />

        {selectedCategories.map((categoryId) => {
          const category = categories.find((cat) => cat.id === categoryId);
          if (!category) return null;

          const selectedItems = selectedItemsByCategory[categoryId] || [];

          return (
            <div key={categoryId} className="border-t first:border-t-0 pt-4">
              <MultiSelectWidget
                key={category.items.length}
                options={category.items.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))}
                placeholder="Select Menu Item"
                handleNewItem={() => handleNewItem(category.id)}
                label={category.name}
                onChange={(selected: Option[]) => {
                  setSelectedItemsByCategory((prev) => ({
                    ...prev,
                    [categoryId]: selected,
                  }));
                }}
                value={selectedItems}
              />
            </div>
          );
        })}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {selectedMenu
            ? isSubmitting
              ? "Updating..."
              : "Update Menu"
            : isSubmitting
            ? "Creating..."
            : "Create Menu"}
        </Button>
      </form>

      <ReusableDialog
        title="Create New Category"
        isOpen={categoryFormDialog}
        setIsOpen={setCategoryFormDialog}
      >
        <CategoryForm onAdd={handleAddCategory} />
      </ReusableDialog>

      <ReusableDialog
        title="Create New Menu Item"
        isOpen={menuItemFormDialog}
        setIsOpen={setMenuItemFormDialog}
      >
        <MenuItemForm
          categoryId={selectedCategoryId!}
          onAdd={handleNewItemAdded}
        />
      </ReusableDialog>
    </div>
  );
};

export default MenuForm;
