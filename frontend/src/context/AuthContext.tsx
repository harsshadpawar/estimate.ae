import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { validateToken } from '../utils/utils';

// Define the context type
interface AuthContextType {
    isAuthenticated: boolean | null; // `null` indicates loading state
    revalidateToken: () => void; // Function to revalidate the token
    getRole:() => void;
    role: string | any;
}

// Create the AuthContext with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for AuthProvider
interface AuthProviderProps {
    children: ReactNode; // React children components
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [role, SetRole] = useState<String | null>(null);
    const revalidateToken = () => {
        const token = localStorage.getItem('access_token');
        const isValid = validateToken(token);
        setIsAuthenticated(isValid);
    };
    const getRole = () => {
        const roles = localStorage.getItem('role');
        SetRole(roles);
        return roles;
    }
    useEffect(() => {
        // Initial validation on app load
        revalidateToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, revalidateToken, getRole,role }}>
            {children}
        </AuthContext.Provider>
    );
};
