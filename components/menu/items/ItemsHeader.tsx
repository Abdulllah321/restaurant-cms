import PageHeader from "@/components/common/PageHeader";
import { PlusSquareIcon } from "lucide-react";
import MenuItemFormModal from "./MenuItemFormModal";
import { Button } from "@/components/ui/button";

export const MenuItemHeader = () => {
  return (
    <PageHeader
      title="Menu Item Management"
      searchPlaceholder="Search Menu Items..."
      formAction="/menus/items"
      actionTrigger={
        <MenuItemFormModal
          trigger={
            <Button>
              <PlusSquareIcon />
              Add Menu Item
            </Button>
          }
        />
      }
    />
  );
};
