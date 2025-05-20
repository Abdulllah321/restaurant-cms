"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import CustomDeleteDialog from "@/components/common/DeleteConfirmationDialog";
import MenuItemFormModal from "./MenuItemFormModal";
import { deleteMenuItem } from "@/actions/menu.actions";
import Image from "next/image";
import { CardFooter } from "@/components/ui/card";

interface MenuItemActionsProps {
  item: MenuItem;
}

export default function MenuItemActions({ item }: MenuItemActionsProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteMenuItem(id);
      toast.success("Menu item deleted successfully");
    } catch  {
      toast.error("Failed to delete menu item");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      {isDeleting === item.id && (
        <div className="absolute top-0 left-0 w-full h-full bg-foreground/50 z-50 flex items-center justify-center">
          <Image src="/loader.gif" alt="loader" width={300} height={300} />
        </div>
      )}
      <CardFooter className="flex gap-3 border-t pt-4">
        <MenuItemFormModal
          trigger={
            <Button variant="secondary" className="w-full">
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          }
          triggerClassName="flex-1"
          selectedItem={item}
        />
        <CustomDeleteDialog
          title="Delete Menu Item"
          description="Are you sure you want to delete this menu item?"
          onConfirm={() => handleDelete(item.id!)}
          trigger={
            <Button variant="destructive" className="w-full">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          }
        />
      </CardFooter>
    </>
  );
}
