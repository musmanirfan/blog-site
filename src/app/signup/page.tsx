"use client"


import Auth from '@/components/auth'
import { auth, db, provider } from '@/firebase/firebseConfig'
import { signInWithPopup } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth/cordova'
import { doc, setDoc } from 'firebase/firestore'
import React from 'react'

export default function page() {

    const signup = async (userName: string, email: string, password: string) => {
        try {
            console.log(email, password, userName);

            const userCrediential = await createUserWithEmailAndPassword(auth, email, password);
            const userData = userCrediential.user;
            saveUserInFirestore(userName, email, userData.uid);
            console.log("inner signup");
            // console.log("in SignUp", userName, email, password);

        } catch (e) {
            console.log(e);
        }
    }

    const saveUserInFirestore = async (userName: string, email: string, uid: string) => {
        let user = { userName, email, uid }
        let docRef = doc(db, "users", uid)
        await setDoc(docRef, user)
    }
    return (<>
        <div><Auth signup={true} func={signup} /></div>
        <button onClick={() => { signInWithPopup(auth, provider) }}>SignIn with Google</button>
    </>
    )
}
