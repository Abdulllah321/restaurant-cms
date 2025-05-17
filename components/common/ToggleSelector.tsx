import { AnimatePresence, motion } from "motion/react";
import { JSX, useEffect, useState } from "react";
import { ChevronDown, PlusCircle } from "lucide-react"; // Optional: for rotating toggle icon

import AnimatedCheckmark from "./AnimatedCheck";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface ToggleSelectorProps<T> {
  items: T[];
  selectedItems: string[];
  onToggle: (id: string) => void;
  getLabel: (item: T) => string;
  getId: (item: T) => string;
  getParentId: (item: T) => string | null;
  getCount?: (item: T) => number;
  className?: string;
  loading?: boolean;
  onAdd?: () => void;
  addButtonLabel?: string;
}

const ToggleSelector = <T,>({
  items,
  selectedItems,
  onToggle,
  getLabel,
  getId,
  getCount,
  getParentId,
  className = "",
  loading = false,
  onAdd,
  addButtonLabel = "Add New",
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
  }, []);

  const renderItems = (parentId = "root", depth = 0): JSX.Element[] => {
    const children = groupedItems[parentId] || [];

    return children.map((item) => {
      const id = getId(item);
      const label = getLabel(item);
      const count = getCount && getCount(item) || null;
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
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onToggle(id)}
                type="button"
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
                {count && (
                  <span className="border-primary-foreground/30 text-primary-foreground/60 ms-1 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {count}
                  </span>
                )}
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
                className="flex items-center gap-1 text-xs truncate transition text-zinc-400 hover:text-white "
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
    <div
      className={`flex flex-col md:flex-row md:flex-wrap md:gap-6 mt-4 ${className}`}
    >
      {loading
        ? Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-24 h-10 mb-2 rounded-lg" />
          ))
        : renderItems()}
      {onAdd && (
        <Button type="button" onClick={onAdd} className="shadow-sm ">
          <PlusCircle
            className="opacity-60 sm:-ms-1"
            size={16}
            aria-hidden="true"
          />
          {addButtonLabel}
        </Button>
      )}
    </div>
  );
};

export default ToggleSelector;
