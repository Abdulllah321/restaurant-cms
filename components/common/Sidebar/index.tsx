"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, LayoutDashboard } from "lucide-react";
import { menuItems } from "./menuItems";
import { topVariants, middleVariants, bottomVariants, Transition } from "./toggleButtonAnimation";
import Link from "next/link";

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    className?: string;
}

export default function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const router = useRouter()
    const toggleItem = (name: string) => {
        setOpenItems((prev) => ({
            ...prev,
            [name]: !prev[name],
        }));
    };

    const navigate = (href: string) => {
        router.push(href)
    }
    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 64 : 256 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`h-screen bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)] w-[256px] border-r border-[var(--color-sidebar-border)] flex flex-col ${className}`}
        >
            {/* Header with animated toggle button */}
            <div className="flex items-center gap-2 px-4 py-4 border-b border-[var(--color-sidebar-border)]">
                <LayoutDashboard size={25} />
                {!isCollapsed && <h2 className="text-xl font-bold">Dashboard</h2>}

            </div>

            {/* Nav Items */}
            <nav className="flex-1 overflow-y-auto px-2 py-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <button
                                onClick={() => item.hasSubmenu ? toggleItem(item.name) : navigate(item.link)}
                                className={`flex items-center cursor-pointer justify-between w-full px-3 py-2 rounded-md transition-colors ${pathname.includes(item.link)
                                    ? "bg-[var(--color-sidebar-primary)] text-[var(--color-sidebar-primary-foreground)]"
                                    : "hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-accent-foreground)]"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-5 h-5" />
                                    {!isCollapsed && <span className="font-medium">{item.name}</span>}
                                </div>
                                {!isCollapsed && item.hasSubmenu && (
                                    openItems[item.name] ? <ChevronUp /> : <ChevronDown />
                                )}
                            </button>

                            {/* Submenu */}
                            <AnimatePresence>
                                {item.hasSubmenu && openItems[item.name] && !isCollapsed && (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="ml-8 mt-1 space-y-1 overflow-hidden"
                                    >
                                        {item.subItems?.map((subItem) => (
                                            <li key={subItem.name}>
                                                <Link
                                                    href={subItem.link}
                                                    className={`block px-3 py-1 rounded text-sm transition-colors 
                          ${pathname === subItem.link
                                                            ? 'font-bold bg-muted/50'
                                                            : ''}`}
                                                >
                                                    {subItem.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </li>
                    ))}
                </ul>
            </nav>
        </motion.aside>
    );
}
