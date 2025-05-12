"use client"
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

 function Breadcrumbs() {
  const pathname = usePathname();
  
  // Remove leading slash and split the path
  const paths = pathname.split("/").filter(Boolean);

  // Build each breadcrumb link
  const breadcrumbs = paths.map((segment, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    const isLast = index === paths.length - 1;

    return (
      <Link
        key={href}
        href={href}
        className={`text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors 
          ${isLast ? "text-sidebar-foreground font-semibold" : ""}
          before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden`}
        aria-current={isLast ? "page" : undefined}
      >
        {segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </Link>
    );
  });

  return (
    <nav className="flex items-center text-sm font-medium max-sm:hidden">
      {breadcrumbs}
    </nav>
  );
}

export default function Header() {
  return (
    <header className="dark flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-sidebar text-sidebar-foreground relative before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 before:z-50">
      <SidebarTrigger className="-ms-2" />
      <div className="flex items-center gap-8 ml-auto">
        <Breadcrumbs />
        {/* <UserDropdown /> */}
      </div>
    </header>
  );
}