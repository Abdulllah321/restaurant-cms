"use client";
import { useState } from "react";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex h-screen">
            <Sidebar isCollapsed={isCollapsed} onToggle={handleToggle} />

            {/* This div needs to be a flex column and take full width beside sidebar */}
            <div className="flex flex-col flex-1">
                <Header onToggle={handleToggle} isCollapsed={isCollapsed} />
                <main className="flex-1 p-6 overflow-auto bg-gray-50">
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
