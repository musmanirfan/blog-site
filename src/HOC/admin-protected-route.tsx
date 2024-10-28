"use client"

import { auth } from '@/firebase/firebseConfig'
import { User } from '@/type/type'
import { CircularProgress } from '@mui/material'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect, useState } from 'react'

type AdminProtectedRoute = {
    children: ReactNode
}


export default function AdminProtectedRoute({ children }: AdminProtectedRoute) {
    const [user, setUser] = useState<null | User>(null)
    const [loading, setLoading] = useState(true)
    const route = useRouter()



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser as User)
            } else {
                setUser(null)
            }
            setLoading(false)
        })
        return () => unsubscribe();
    }, [])


    useEffect(() => {
        if (!loading) {
            if (!user) {
                route.push("/signup")
            } else if (user.uid === "3VKzk58gZ0a3GlegU9y8dZLpNcC3") {
                route.push("/admin")
            } else {
                route.push("/")
            }
        }
    }, [loading, user])

    if (loading) {
        return <div className="flex justify-center items-center h-[100vh]">
            <CircularProgress color='success' />
        </div>
    }

    if (user && user.uid === "3VKzk58gZ0a3GlegU9y8dZLpNcC3") {
        return <>{children}</>
    }
}
