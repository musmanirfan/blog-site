"use client"


import Auth from '@/components/auth'
import { auth, db, provider } from '@/firebase/firebseConfig'
import { signInWithPopup, updateProfile } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth/cordova'
import { doc, setDoc } from 'firebase/firestore'
import React from 'react'

export default function page() {

    const handlePopup = async () => {
        try {
            const res = await signInWithPopup(auth, provider)
            console.log(res);
        } catch (error) {
            console.log(error);
            
        }
    }

    const signup = async (userName: string, email: string, password: string) => {
        try {
            console.log(email, password, userName);

            const userCrediential = await createUserWithEmailAndPassword(auth, email, password);
            const userData = userCrediential.user;
            updateProfile(userData, {
                displayName: userName,
            })
            saveUserInFirestore(userName, email, userData.uid);
            console.log("inner signup");
            // console.log("in SignUp", userName, email, password);

        } catch (e) {
            console.log(e);
        }
    }

    const saveUserInFirestore = async (displayName: string, email: string, uid: string) => {
        let user = { displayName, email, uid }
        let docRef = doc(db, "users", uid)
        await setDoc(docRef, user)
    }
    return (<>
        <div><Auth signup={true} func={signup} /></div>
        <button onClick={handlePopup}>SignIn with Google</button>
    </>
    )
}
