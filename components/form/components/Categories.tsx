// components/Categories.tsx
"use client";

import {
  getCategoriesByBranch,
} from "@/actions/categories.actions";
import ToggleSelector from "@/components/common/ToggleSelector";
import { fetchSelectedBranch } from "@/data/constants";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

const Categories = ({
  selectedCategories,
  handleToggleCategory,
  handleAddCategory,
  categories,
  setCategories
}: {
  selectedCategories: string[];
  handleToggleCategory: (id: string) => void;
  handleAddCategory?: () => void;
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>
}) => {
  const [loading, setLoading] = useState(true); // Start with true since we're loading initially
  const [branchId, setBranchId] = useState<string | null>(null);

  useEffect(() => {
    const branch = fetchSelectedBranch();
    if (branch) {
      setBranchId(branch.id);
    } else {
      setLoading(false); // No branch selected, but we're done trying
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!branchId) return; // Don't fetch if no branchId

      setLoading(true);
      try {
        const result = await getCategoriesByBranch(branchId);
        if (result) {
          setCategories(result as Category[]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [branchId]); // Now depends on branchId

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
        selectedItems={selectedCategories}
        onToggle={handleToggleCategory}
        onAdd={handleAddCategory}
        addButtonLabel="Add New Category"
        getLabel={(category) => category.name}
        getId={(category) => category.id}
        getParentId={() => null}
        loading={loading}
      />
    </div>
  );
};

export default Categories;