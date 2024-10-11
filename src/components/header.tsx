import { auth } from '@/firebase/firebseConfig'
import React from 'react'

export default function Header() {
    
    return (
        <div>
            <h2>Hello {auth.currentUser?.displayName ?? "Plz Logi"}</h2>
        </div>
    )
}
