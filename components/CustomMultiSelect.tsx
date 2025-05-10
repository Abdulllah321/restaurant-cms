import { useId } from "react";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";

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
}: MultiSelectWidgetProps) {
  const id = useId();

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-muted-foreground">
          {label}
        </Label>
      )}
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
      />
      <p className="text-muted-foreground mt-2 text-xs" role="region" aria-live="polite">
        Inspired by{" "}
        <a
          className="hover:text-foreground underline"
          href="https://shadcnui-expansions.typeart.cc/docs/multiple-selector"
          target="_blank"
          rel="noopener nofollow"
        >
          shadcn/ui expansions
        </a>
      </p>
    </div>
  );
}
