"use client"

import { MenuItem, /* Select, */ TextField } from '@mui/material'
import { FormEvent, useState } from 'react'

type signupType = {
    signup?: boolean,
    func?: (userName: string, email: string, password: string) => void
    loginFunc?: (email: string, password: string) => void
}

export default function Auth({ signup, func, loginFunc }: signupType) {

    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (

        <>
            {signup &&
                <TextField type='text' label="Name" variant="outlined" value={userName} onChange={e => setUserName(e.target.value)} />
            }
            <TextField type="email" label="Email" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
            <TextField type="password" id="outlined-password-input" label="Password" value={password} onChange={e => setPassword(e.target.value)} />

            {signup ?
                <button onClick={() => { func && func(userName, email, password) }}>Signup</button> :
                <button onClick={() => { loginFunc && loginFunc(email, password) }}>Login</button>
            }
        </>
    )
}
