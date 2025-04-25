import Sidebar from "@/components/common/Sidebar";
import { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar className="h-full w-64 bg-sidebar" />

            {/* Main content area */}
            <main className="flex-1 p-6">
                <div className="container mx-auto">{children}</div>
            </main>
        </div>
    );
}
