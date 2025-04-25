"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion"; // For animations
import { ChevronDown, ChevronUp } from "lucide-react";
import { menuItems } from "./menuItems"; // Assuming you have the menu items elsewhere

function Sidebar({ className }: { className?: string }) {
    const pathname = usePathname();
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
    const [isCollapsed, setIsCollapsed] = useState(false); // New state for toggling sidebar
    const toggleItem = (name: string) => {
        setOpenItems(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const handleSidebarToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`w-${isCollapsed ? "16" : "64"} h-screen p-4 bg-sidebar text-sidebar-primary-foreground transition-all duration-300 ${className}`}>
            <div className="flex justify-between items-center mb-8">
                <h2 className={`text-2xl font-bold text-center ${isCollapsed ? 'hidden' : ''}`}>Dashboard</h2>
                <button onClick={handleSidebarToggle} className="p-2">
                    {isCollapsed ? "☰" : "×"} {/* Toggle button to collapse */}
                </button>
            </div>
            <nav>
                <ul className="space-y-4">
                    {menuItems.map(item => (
                        <li key={item.name}>
                            <div>
                                <button
                                    onClick={() => item.hasSubmenu && toggleItem(item.name)}
                                    className={`flex items-center space-x-3 cursor-pointer px-4 py-3 rounded-lg transition-all duration-300 justify-between w-full ease-in-out ${pathname.includes(item.link) ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-transparent hover:bg-sidebar-accent'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        {isCollapsed ? null : <item.icon className="w-5 h-5" />}
                                        <span className={`font-medium ${isCollapsed ? 'hidden' : ''}`}>{item.name}</span>
                                    </div>
                                    {item.hasSubmenu && (openItems[item.name] ? <ChevronUp className="ml-auto" /> : <ChevronDown className="ml-auto" />)}
                                </button>
                                {item.hasSubmenu && openItems[item.name] && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden ml-4 mt-2"
                                    >
                                        <ul className="space-y-2">
                                            {item.subItems?.map(subItem => (
                                                <li key={subItem.name}>
                                                    <a
                                                        href={subItem.link}
                                                        className="block hover:bg-sidebar-accent text-sidebar-foreground px-4 py-2 rounded-lg transition-all duration-200"
                                                    >
                                                        {subItem.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
