"use client"

import Auth from '@/components/auth'
import { auth, provider } from '@/firebase/firebseConfig'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

export default function Page() {
    const route = useRouter();

    const handleGoogleSignup = async () => {
        try {
            const res = await signInWithPopup(auth, provider)
            // const userData = res.user;
            // const userName = userData.displayName || "anonymus";
            // const email = userData.email;
            // const uid = userData.uid;

            route.push("/")
            console.log(res);
        } catch (error) {
            console.log(error);

        }
    }
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
        <div className='flex flex-col'>
            <div><Auth loginFunc={login} /></div>
            <button
                className="w-[400px] !mx-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 mt-4"
                onClick={handleGoogleSignup}>Sign In with Google</button>
        </div>
    )
}
