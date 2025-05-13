// UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the type for the user profile
interface UserProfile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string
    title: string;
    company_name: string;
    avatar?: string; 
}

interface UserContextProps {
    user: UserProfile | null;
    setUser: (user: UserProfile | null) => void;
    fetchUserProfile: () => Promise<void>;
}

// Create the context
const UserContext = createContext<UserContextProps | undefined>(undefined);

// Provide the context
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    // API call to fetch user profile
    const fetchUserProfile = async () => {
        try {
            const token = await localStorage.getItem("access_token");
            const response = await fetch("http://localhost:5001/api/profile", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`, // Add token here
                },
            });
            if (response.ok) {
                
                const res = await response.json();
                const data=res.data
                setUser(data)
            } else {
                console.error("profile Error: ");

            }
        } catch (error) {
            console.error("profile Error: ", error);

        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, fetchUserProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};