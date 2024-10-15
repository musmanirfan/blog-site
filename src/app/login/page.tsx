"use client"

import Auth from '@/components/auth'
import { auth } from '@/firebase/firebseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

export default function Page() {
    const route = useRouter();
    const login = async (email: string, password: string) => {
        try {
            console.log(email, password);
            const userCrediential = await signInWithEmailAndPassword(auth, email, password);
            const userData = userCrediential.user;
            console.log(userData, "userData");
            route.push("/")
        } catch (e) {
            if (e instanceof Error) {
                toast.error(e.message);
                console.log(typeof e.message); // 'string'
            } else {
                toast.error('An unexpected error occurred');
                console.log(typeof e); // could be an object or string, depending on the type
            }
        }
    }
    return (
        <div><Auth loginFunc={login} /></div>
    )
}
