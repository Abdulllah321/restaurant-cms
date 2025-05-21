// components/Breadcrumbs.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useBreadcrumbs } from "@/context/BreadcrumbContext";

function Breadcrumbs() {
  const pathname = usePathname();
  const { breadcrumbs: manualBreadcrumbs } = useBreadcrumbs();

  const dynamicBreadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((segment, index, arr) => ({
      href: "/" + arr.slice(0, index + 1).join("/"),
      label: segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    }));

  const breadcrumbs = manualBreadcrumbs ?? dynamicBreadcrumbs;

  return (
    <nav className="flex items-center text-sm font-medium max-sm:hidden">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <Link
            key={crumb.href}
            href={crumb.href}
            className={`text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors 
            ${isLast ? "text-sidebar-foreground font-semibold" : ""}
            before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden`}
            aria-current={isLast ? "page" : undefined}
          >
            {crumb.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
