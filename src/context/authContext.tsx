"use client"

import { auth } from '@/firebase/firebseConfig';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'

interface AuthContextType {
    user: userType | null;
}

type userType = {
    email: string | null,
    uid: string,
    emailVerified: boolean,
}

type AuthContextProviderType = {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | null>(null)

export default function AuthContextProvider({ children }: AuthContextProviderType) {

    const [user, setUser] = useState<null | userType>(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);
