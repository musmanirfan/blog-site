"use client"

import Auth from '@/components/auth'
import { auth } from '@/firebase/firebseConfig'
import { signInWithEmailAndPassword } from 'firebase/auth'
import React from 'react'

export default function page() {

    const login = async (email: string, password: string) => {
        try {
            console.log(email, password);
            let userCrediential = await signInWithEmailAndPassword(auth, email, password);
            const userData = userCrediential.user;
            console.log(userData, "userData");
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <div><Auth loginFunc={login} /></div>
    )
}
