"use client";
import { useState } from "react";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/AppSidebar";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-sidebar group/sidebar-inset">

                {/* This div needs to be a flex column and take full width beside sidebar */}
                <div className="flex flex-col flex-1">
                    <Header onToggle={handleToggle} isCollapsed={isCollapsed} />
                    <main className="flex-1 p-6 overflow-auto">
                        <div className="container mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
