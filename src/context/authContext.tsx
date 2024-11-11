// context/authContext.tsx
"use client";

import { auth } from '@/firebase/firebseConfig';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

type AuthContextProviderType = {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export default function AuthContextProvider({ children }: AuthContextProviderType) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);
