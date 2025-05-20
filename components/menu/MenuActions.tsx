"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Edit,  Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomDeleteDialog from "../common/DeleteConfirmationDialog";
import { toast } from "sonner";
import { deleteMenu } from "@/actions/menu.actions";
import Image from "next/image";

const MenuActions = ({ menu }: { menu: Menu }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteMenu(id);
      toast.success("Menu item deleted successfully");
    } catch {
      toast.error("Failed to delete menu item");
    } finally {
      setIsDeleting(null);
    }
  };
  return (
    <>
      {" "}
      {isDeleting === menu.id && (
        <div className="absolute top-0 left-0 w-full h-full bg-foreground/50 z-50 flex items-center justify-center">
          <Image src="/loader.gif" alt="loader" width={300} height={300} />
        </div>
      )}
      <div className="flex absolute top-4 right-4 gap-4">
        <Button
          onClick={() => router.push("/menus/" + menu.id)}
          className="rounded-full"
        >
          <Edit />
        </Button>
        <CustomDeleteDialog
          title="Delete Menu"
          description="Are you sure you want to delete this menu?"
          onConfirm={() => handleDelete(menu.id!)}
          trigger={
            <Button variant="destructive" className="rounded-full">
              <Trash2 />
            </Button>
          }
        />
      </div>
    </>
  );
};

export default MenuActions;
