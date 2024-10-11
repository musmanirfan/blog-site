"use client"


import Auth from '@/components/auth'
import { auth, db, provider } from '@/firebase/firebseConfig'
import { signInWithPopup, updateProfile } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth/cordova'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function page() {
    const route = useRouter()

    const saveUserInFirestore = async (displayName: string, email: string, uid: string) => {
        let user = { displayName, email, uid }
        let docRef = doc(db, "users", uid)
        await setDoc(docRef, user)
    }

    const handleGoogleSignup = async () => {
        try {
            const res = await signInWithPopup(auth, provider)
            const userData = res.user;
            const userName = userData.displayName || "anonymus";
            const email = userData.email;
            const uid = userData.uid;

            await saveUserInFirestore(userName, email!, userData.uid);
            route.push("/")
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
            await updateProfile(userData, {
                displayName: userName,
            })
            await saveUserInFirestore(userName, email, userData.uid);
            console.log("inner signup");
            // console.log("in SignUp", userName, email, password);
            route.push("/")

        } catch (e) {
            console.log(e);
        }
    }


    return (<>
        <div><Auth signup={true} func={signup} /></div>
        <button onClick={handleGoogleSignup}>SignIn with Google</button>
    </>
    )
}
