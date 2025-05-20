"use client";

import { ReusableDialog } from "@/components/common/reuseable-dialog";
import MenuItemForm from "@/components/form/MenuItemForm";
import React, { ReactNode, useState } from "react";

interface MenuItemFormModalProps {
  trigger: ReactNode;
  triggerClassName?: string;
  selectedItem?: MenuItem;
}

const MenuItemFormModal: React.FC<MenuItemFormModalProps> = ({
  trigger,
  triggerClassName,
  selectedItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className={triggerClassName}>
        {trigger}
      </div>

      <ReusableDialog
        title={selectedItem ? "Edit Menu Item" : "Create New Menu Item"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <MenuItemForm onAdd={handleSuccess} selectedMenuItem={selectedItem!} />
      </ReusableDialog>
    </>
  );
};

export default MenuItemFormModal;
