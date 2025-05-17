import { useId } from "react";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";

interface MultiSelectWidgetProps {
  label?: string;
  options: Option[];
  value?: Option[];
  placeholder?: string;
  onChange?: (selected: Option[]) => void;
  hideClearAllButton?: boolean;
  hidePlaceholderWhenSelected?: boolean;
  emptyMessage?: string;
  commandLabel?: string;
  disabled?: boolean;
  className?: string;
  handleNewItem?: () => void;
}

export default function MultiSelectWidget({
  label,
  options,
  value = [],
  placeholder = "Select options",
  onChange,
  hideClearAllButton = false,
  hidePlaceholderWhenSelected = false,
  emptyMessage = "No results found",
  commandLabel = "Select options",
  disabled = false,
  className = "",
  handleNewItem,
}: MultiSelectWidgetProps) {
  const id = useId();

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={cn(
          "flex items-center",
          label ? "justify-between" : "justify-end"
        )}
      >
        {label && (
          <Label
            htmlFor={id}
            className="text-sm font-medium text-muted-foreground mb-2"
          >
            {label}
          </Label>
        )}
        {handleNewItem && (
          <Button size={"sm"} className="rounded-full p-2" variant={"ghost"} type="button" onClick={handleNewItem}>
            <PlusCircle size={10} />
          </Button>
        )}
      </div>
      <MultipleSelector
        commandProps={{ label: commandLabel }}
        value={value}
        defaultOptions={options}
        placeholder={placeholder}
        onChange={onChange}
        hideClearAllButton={hideClearAllButton}
        hidePlaceholderWhenSelected={hidePlaceholderWhenSelected}
        disabled={disabled}
        emptyIndicator={<p className="text-center text-sm">{emptyMessage}</p>}
        className="h-full"
      />{" "}
      {/* <p
        className="text-muted-foreground mt-2 text-xs"
        role="region"
        aria-live="polite"
      >
        Inspired by{" "}
        <a
          className="hover:text-foreground underline"
          href="https://shadcnui-expansions.typeart.cc/docs/multiple-selector"
          target="_blank"
          rel="noopener nofollow"
        >
          shadcn/ui expansions
        </a>
      </p> */}
    </div>
  );
}
