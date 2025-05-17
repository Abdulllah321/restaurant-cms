"use client";

import { Label } from "@radix-ui/react-label";
import React, { useState, useActionState } from "react";
import { Input } from "../ui/input";
import { createMenuItem, updateMenuItem } from "@/actions/menu.actions";
import { Button } from "../ui/button";
import { fetchSelectedBranch } from "@/data/constants";
import UploadImage from "../common/UploadImage";
import { toast } from "sonner";

export type MenuItemInput = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
};

const MenuItemForm = ({
  selectedMenuItem,
  onAdd,
  categoryId,
}: {
  selectedMenuItem?: MenuItemInput;
  onAdd?: (menuItem: MenuItem) => void;
  categoryId?: string;
}) => {
  const branchId = fetchSelectedBranch()?.id;
  const [imageFile, setImageFile] = useState<File | null>(null);

  const action = async function (_: unknown, formData: FormData) {
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = selectedMenuItem
      ? await updateMenuItem(_, formData)
      : await createMenuItem(_, formData);

    if (response.errors) {
      console.error("[FORM_ERROR]", response.errors);
      toast.error(response.errors as string);
      return response;
    }

    if (onAdd) {
      onAdd(response.menuItem as MenuItem);
    }

    return response;
  };

  const [state, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => await action(_, formData),
    null
  );

  const getDefaultValue = (field: keyof MenuItemInput) => {
    if (selectedMenuItem && selectedMenuItem[field]) {
      return selectedMenuItem[field] as string;
    }
    return state &&
      "values" in state &&
      typeof (state.values as MenuItemInput)?.[field] === "string"
      ? ((state.values as MenuItemInput)?.[field] as string)
      : "";
  };

  const getErrorMessage = (field: keyof MenuItemInput) => {
    return state && "errors" in state
      ? (state.errors as Record<keyof MenuItemInput, string | undefined>)?.[
          field
        ] || ""
      : "";
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Image Upload */}
      <UploadImage
        onFileSelect={(file) => {
          setImageFile(file);
        }}
        // defaultPreview={imageFile}
      />

      {/* Name */}
      <div>
        <Label>Name</Label>
        <Input
          name="name"
          defaultValue={getDefaultValue("name") as string}
          disabled={pending}
        />
        {getErrorMessage("name") && (
          <p className="text-destructive">{getErrorMessage("name")}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <Input
          name="description"
          defaultValue={getDefaultValue("description") as string}
          disabled={pending}
        />
        {getErrorMessage("description") && (
          <p className="text-destructive">{getErrorMessage("description")}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <Label>Price</Label>
        <Input
          name="price"
          type="number"
          defaultValue={getDefaultValue("price") as string}
          disabled={pending}
        />
        {getErrorMessage("price") && (
          <p className="text-destructive">{getErrorMessage("price")}</p>
        )}
      </div>

      {/* Branch ID */}
      <Input type="hidden" value={branchId} name="branchId" />

      {/* Category ID */}
      <Input type="hidden" value={categoryId} name="categoryId" />

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? selectedMenuItem
            ? "Updating..."
            : "Creating..."
          : selectedMenuItem
          ? "Update Menu Item"
          : "Create Menu Item"}
      </Button>
    </form>
  );
};

export default MenuItemForm;
