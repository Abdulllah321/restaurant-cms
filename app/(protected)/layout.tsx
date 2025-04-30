"use client";
import { useState } from "react";
import Sidebar from "@/components/common/Sidebar";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex h-screen">
            <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />

            <main
                className={`transition-all duration-300 flex-1 p-6 overflow-auto`}
                style={{ marginLeft: isCollapsed ? '64px' : '256px' }}
            >
                <div className="container mx-auto">{children}</div>
            </main>
        </div>
    );
}
