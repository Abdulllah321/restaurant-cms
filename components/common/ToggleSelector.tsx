"use client";
import { AnimatePresence, motion } from "framer-motion";
import { JSX, useEffect, useState } from "react";
import { ChevronDown, Plus } from "lucide-react"; // Added Plus icon

import AnimatedCheckmark from "./AnimatedCheck";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface ToggleSelectorProps<T> {
  items: T[];
  selectedItems: string[];
  onToggle: (id: string) => void;
  onAdd?: () => void; // New prop for add functionality
  addButtonLabel?: string; // Custom label for add button
  getLabel: (item: T) => string;
  getId: (item: T) => string;
  getParentId: (item: T) => string | null;
  className?: string;
  loading?: boolean;
}

const ToggleSelector = <T,>({
  items,
  selectedItems,
  onToggle,
  onAdd,
  addButtonLabel = "Add New", // Default label
  getLabel,
  getId,
  getParentId,
  className = "",
  loading = false,
}: ToggleSelectorProps<T>) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const groupedItems = items.reduce((acc, item) => {
    const parentId = getParentId(item) || "root";
    if (!acc[parentId]) acc[parentId] = [];
    acc[parentId].push(item);
    return acc;
  }, {} as Record<string, T[]>);

  useEffect(() => {
    const expandedMap: Record<string, boolean> = {};
    Object.keys(groupedItems).forEach((parentId) => {
      if (parentId !== "root") expandedMap[parentId] = true;
    });
    setExpanded(expandedMap);
  }, [items]);

  const renderItems = (parentId = "root", depth = 0): JSX.Element[] => {
    const children = groupedItems[parentId] || [];

    return children.map((item) => {
      const id = getId(item);
      const label = getLabel(item);
      const isSelected = selectedItems.includes(id);
      const hasChildren = groupedItems[id]?.length > 0;
      const isExpanded = expanded[id];

      return (
        <div key={id} className="relative group">
          <div className="flex flex-col items-start gap-2 mb-2 md:flex-row md:items-center">
            <motion.div
              className="relative"
              initial={false}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                type="button"
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onToggle(id)}
                className="relative text-sm min-w-[140px] transition-colors"
              >
                <span className="absolute -translate-y-1/2 left-3 top-1/2">
                  <AnimatePresence>
                    {isSelected && <AnimatedCheckmark />}
                  </AnimatePresence>
                </span>
                <motion.span
                  animate={{
                    paddingLeft: isSelected ? 28 : 0,
                    color: isSelected ? "#fff" : undefined,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {label}
                </motion.span>
              </Button>
            </motion.div>

            {hasChildren && (
              <button
                onClick={() =>
                  setExpanded((prev) => ({
                    ...prev,
                    [id]: !prev[id],
                  }))
                }
                type="button"
                className="flex items-center gap-1 text-xs truncate transition text-zinc-400 hover:text-white"
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
                {isExpanded ? "Hide" : "Show"} Subcategories
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {hasChildren && isExpanded && (
              <motion.div
                key="sub"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="pl-4 ml-4 space-y-2 overflow-hidden truncate border-l border-zinc-700"
              >
                <div className="border-l-[1px] border-zinc-600 ml-[10px] pl-2">
                  {renderItems(id, depth + 1)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:flex-wrap md:gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="w-24 h-10 mb-2 rounded-lg" />
            ))
          : renderItems()}
      </div>

      {/* Add button at the bottom */}
      {onAdd && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="pt-2 border-zinc-700"
        >
          <Button
            variant="secondary"
            onClick={onAdd}
            type="button"

            // className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white"
          >
            <Plus size={16} />
            {addButtonLabel}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ToggleSelector;
