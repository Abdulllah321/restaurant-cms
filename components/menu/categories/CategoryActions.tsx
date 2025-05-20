// components/category/CategoryActions.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CustomDeleteDialog from "@/components/common/DeleteConfirmationDialog";
import CategoryFormModal from "./CategoryFormModel";
import { deleteCategory } from "@/actions/categories.actions";
import { useState } from "react";
import Image from "next/image";

interface CategoryActionsProps {
  category: Category;
}

export default function CategoryActions({ category }: CategoryActionsProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const handleDeleteCategory = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteCategory(id);
      toast.success("Deleted Category Successfully");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      {isDeleting === category.id && (
      <div className="absolute top-0 left-0 w-full h-full bg-foreground/50 z-50 flex items-center justify-center">
        <Image src={"/loader.gif"} alt="loader" width={300} height={300} />
      </div>
       )}
      <div className="flex gap-3 border-t pt-2">
        <CategoryFormModal
          trigger={
            <Button variant={"secondary"} className="w-full">
              <Edit3 />
              Edit
            </Button>
          }
          triggerClassName="flex-1"
          selectedCategory={category}
        />
        <CustomDeleteDialog
          title="Delete Category"
          description="Are you sure you want to delete this category?"
          onConfirm={() => handleDeleteCategory(category.id)}
          trigger={
            <Button variant={"destructive"} className="w-full">
              <Trash2 />
              Delete
            </Button>
          }
        />
      </div>
    </>
  );
}
