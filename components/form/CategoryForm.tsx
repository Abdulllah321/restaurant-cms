import { Label } from "@radix-ui/react-label";
import React, { useActionState, useEffect, useId } from "react";
import { Input } from "../ui/input";
import { createCategory, updateCategory } from "@/actions/categories.actions";
import { Button } from "../ui/button";
import { fetchSelectedBranch } from "@/data/constants";

export type CategoryInput = {
  name: string;
  branchId: string;
  items: MenuItem[];
};

const CategoryForm = ({
  selectedCategory,
  onAdd
}: {
  selectedCategory?: Category;
  onAdd?: (category: Category
  ) => void
}) => {
  const action = async function (_: unknown, formData: FormData) {
    const response = selectedCategory
      ? await updateCategory(_, formData)
      : await createCategory(_, formData);
    onAdd && onAdd(response.category as Category);

    return response;
  }

  const branchId = fetchSelectedBranch()?.id;


  const [state, formAction, pending] = useActionState(
    async (_: unknown, formData: FormData) => await action(_, formData),
    null
  );

  const getDefaultValue = (field: keyof CategoryInput) => {
    return selectedCategory?.[field] ?? "";
  };

  const getErrorMessage = (field: keyof CategoryInput) => {
    return state && "errors" in state
      ? (state.errors as Record<keyof CategoryInput, string | undefined>)?.[
      field
      ]
      : "";
  };

  return (
    <form action={formAction} className="space-y-6">
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
        <Input type="hidden" value={branchId} name="branchId" />
      </div>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? selectedCategory
            ? "Updating..."
            : "Creating..."
          : selectedCategory
            ? "Update Menu"
            : "Create Menu"}
      </Button>
    </form>
  );
};

export default CategoryForm;
