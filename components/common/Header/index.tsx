import { motion } from "framer-motion";
import { topVariants, middleVariants, bottomVariants, Transition } from "../Sidebar/toggleButtonAnimation";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Header({
  onToggle,
  isCollapsed,
}: {
  onToggle: () => void;
  isCollapsed: boolean;
}) {
  return (
    <header className="dark flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-sidebar text-sidebar-foreground relative before:absolute before:inset-y-3 before:-left-px before:w-px before:bg-gradient-to-b before:from-white/5 before:via-white/15 before:to-white/5 before:z-50">
      <SidebarTrigger className="-ms-2" />
      <div className="flex items-center gap-8 ml-auto">
        <nav className="flex items-center text-sm font-medium max-sm:hidden">
          <a
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
            href="#"
            aria-current
          >
            Playground
          </a>
          <a
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
            href="#"
          >
            Dashboard
          </a>
          <a
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
            href="#"
          >
            Docs
          </a>
          <a
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors [&[aria-current]]:text-sidebar-foreground before:content-['/'] before:px-4 before:text-sidebar-foreground/30 first:before:hidden"
            href="#"
          >
            API Reference
          </a>
        </nav>
        {/* <UserDropdown /> */}
      </div>
    </header>
  );
}
