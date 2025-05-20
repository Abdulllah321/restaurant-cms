"use client";

import { getCategories } from "@/actions/categories.actions";
import ToggleSelector from "@/components/common/ToggleSelector";
import { getSelectedBranchFromCookies } from "@/data/constants";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

const FormCategories = ({
  selectedCategories = [], // Default empty array
  handleToggleCategory,
  handleAddCategory,
  categories,
  setCategories,
}: {
  selectedCategories?: string[]; // Make optional with array type
  handleToggleCategory: (id: string) => void;
  handleAddCategory?: () => void;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
}) => {
  const [loading, setLoading] = useState(true);
  const [branchId, setBranchId] = useState<string | null>(null);

  // Debug selectedCategories
  useEffect(() => {
    if (!Array.isArray(selectedCategories)) {
      console.error('selectedCategories is not an array:', selectedCategories);
    }
  }, [selectedCategories]);

  useEffect(() => {
    const branch = getSelectedBranchFromCookies();
    if (branch) {
      setBranchId(branch.id);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!branchId) return;

      setLoading(true);
      try {
        const result = await getCategories(branchId);
        if (result) {
          setCategories(result.categories as Category[]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [branchId, setCategories]);

  if (!branchId && !loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Please select a branch to view categories
      </div>
    );
  }

  return (
    <div>
      <ToggleSelector
        items={categories}
        selectedItems={selectedCategories} // Now guaranteed to be an array
        onToggle={handleToggleCategory}
        onAdd={handleAddCategory}
        addButtonLabel="Add New Category"
        getLabel={(category) => category.name}
        getId={(category) => category.id}
        getCount={(category) => category._count?.items ?? 0}
        getParentId={() => null}
        loading={loading}
      />
    </div>
  );
};

export default FormCategories;