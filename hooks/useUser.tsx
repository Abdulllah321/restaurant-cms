import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

// Define user type (same as in the hook)
interface User {
    userId: string;
    email: string;
}

interface UserContextType {
    user: User | null;
    isAuthenticated: boolean | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/check-user");
                const data = await response.json();

                if (data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUser(data.user);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setIsAuthenticated(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, isAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};
