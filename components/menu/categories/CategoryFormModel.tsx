"use client";
import { ReusableDialog } from "@/components/common/reuseable-dialog";
import CategoryForm from "@/components/form/CategoryForm";
import React, { ReactNode, useState } from "react";

interface CategoryFormModalProps {
  trigger: ReactNode;
  triggerClassName?: string;
  selectedCategory?: Category;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  trigger,
  selectedCategory,triggerClassName
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddNewCategory = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Trigger Element */}
      <div onClick={handleOpen} className={triggerClassName}>{trigger}</div>

      {/* Modal */}
      <ReusableDialog
        title="Create New Category"
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      >
        <CategoryForm
          onAdd={handleAddNewCategory}
          selectedCategory={selectedCategory}
        />
      </ReusableDialog>
    </>
  );
};

export default CategoryFormModal;
