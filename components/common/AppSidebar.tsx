import * as React from "react";

// import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { menuItems } from "@/data/menuItems";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { BranchSwitcher } from "./branch-switcher";
import { getAllBranches } from "@/actions/branch.actions";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = React.useState<{ [key: string]: boolean }>(
    {}
  );
  const [branches, setBranches] = React.useState<BranchSwitcher[]>([]);

  async function getBranches() {
    const branchData = await getAllBranches();

    const formattedBranches =
      branchData.branches?.map((branch) => ({
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          branch.name
        )}&background=random`,
        ...branch,
      })) || [];

    setBranches(formattedBranches);
  }

  React.useEffect(() => {
    getBranches();
  }, []);

  const toggleSubMenu = (name: string) => {
    setOpenMenus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <Sidebar {...props} className="dark !border-none">
      <SidebarHeader className="flex items-center gap-3 flex-row flex-nowrap text-sidebar-accent px-4 pt-4">
        <BranchSwitcher branches={branches} getBranches={getBranches} />
      </SidebarHeader>
      <SidebarContent>
        {/* We only show the first parent group */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            Items
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = item.link === "/" ? pathname === item.link : pathname.startsWith(item.link);
                return (
                  <React.Fragment key={item.name}>
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        className="group/menu-button font-medium text-sidebar-foreground gap-3 h-9 rounded-md data-[active=true]:hover:bg-transparent data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto"
                        isActive={isActive}
                      >
                        <Link
                          href={item.link}
                          onClick={(e) => {
                            if (item.hasSubmenu) {
                              e.preventDefault();
                              toggleSubMenu(item.name);
                            }
                          }}
                        >
                          {item.icon && (
                            <item.icon
                              className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground group-hover/menu-button:text-sidebar"
                              size={22}
                              aria-hidden="true"
                            />
                          )}
                          <span>{item.name}</span>
                          {item.hasSubmenu &&
                            (openMenus[item.name] ? (
                              <ChevronUp
                                size={18}
                                className="ml-auto text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground group-hover/menu-button:text-sidebar transition-all duration-300"
                              />
                            ) : (
                              <ChevronDown
                                size={18}
                                className="ml-auto text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground group-hover/menu-button:text-sidebar transition-all duration-300"
                              />
                            ))}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {item.hasSubmenu && (
                      <div
                        key={`${item.name}-submenu`}
                        className={`overflow-hidden transition-all duration-300 ${openMenus[item.name]
                          ? "max-h-60 opacity-100"
                          : "max-h-0 opacity-0"
                          }`}
                      >
                        {item.subItems.map((subItem) => (
                          <SidebarMenuItem key={`${subItem.link}-subitem`}>
                            <SidebarMenuButton
                              asChild
                              className={`group/menu-button font-medium gap-3 h-9 rounded-md hover:bg-sidebar-primary/10 ${pathname === subItem.link
                                ? "hover:text-primary"
                                : "hover:text-sidebar-foreground"
                                } [&>svg]:size-auto ${pathname === subItem.link
                                  ? "text-primary font-bold"
                                  : "text-sidebar-foreground/70"
                                }`}
                            >
                              <Link
                                href={subItem.link}
                                className="flex items-center gap-3 pl-6"
                              >
                                <span>{subItem.name}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
