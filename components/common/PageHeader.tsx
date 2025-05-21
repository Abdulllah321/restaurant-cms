"use client";
import { ReactNode } from "react";
import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightIcon, PlusCircle, SearchIcon } from "lucide-react";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

interface PageHeaderProps {
  isCard?: boolean;
  title: string;
  searchPlaceholder?: string;
  actionButtonLabel?: string;
  actionButtonIcon?: ReactNode;
  actionTrigger?: ReactNode;
  formAction?: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
}

export default function PageHeader({
  title,
  searchPlaceholder = "Search...",
  actionButtonLabel = "Add",
  actionButtonIcon = <PlusCircle />,
  actionTrigger,
  formAction,
  isCard = true,
}: PageHeaderProps) {
  const Comp = isCard ? CardHeader : "div";
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  return (
    <Comp className="flex justify-between mb-6 flex-row items-center px-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="flex items-center gap-4">
        {formAction && (
          <Form className="relative" action={formAction}>
            <Input
              id="Search"
              className="peer ps-9 pe-9"
              name="query"
              placeholder={searchPlaceholder}
              type="search"
              defaultValue={query || ""}
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <SearchIcon size={16} />
            </div>
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Submit search"
              type="submit"
            >
              <ArrowRightIcon size={16} aria-hidden="true" />
            </button>
          </Form>
        )}
        {actionTrigger || (
          <Button>
            {actionButtonIcon}
            {actionButtonLabel}
          </Button>
        )}
      </div>
    </Comp>
  );
}
