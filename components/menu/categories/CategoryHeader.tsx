import PageHeader from "@/components/common/PageHeader";
import {  PlusSquareIcon } from "lucide-react";
import CategoryFormModal from "./CategoryFormModel";
import { Button } from "@/components/ui/button";

export const CategoryHeader = () => {
  return (
    <PageHeader
      title="Category Management"
      searchPlaceholder="Search Categories..."
      formAction={"/menus/categories"}
      actionTrigger={
        <CategoryFormModal
          trigger={
            <Button>
              <PlusSquareIcon />
              Add Category
            </Button>
          }
        />
      }
    />
  );
};
