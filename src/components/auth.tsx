"use client"

import { signupType } from '@/type/type'
import { MenuItem, /* Select, */ TextField } from '@mui/material'
import Link from 'next/link'
import { FormEvent, useState } from 'react'



export default function Auth({ signup, func, loginFunc }: signupType) {

    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (

        <>
            <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">
                    {signup ? "Sign Up" : "Login"}
                </h2>

                {signup && (
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 transition duration-300 dark:bg-gray-800 dark:text-gray-200"
                        />
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 transition duration-300 dark:bg-gray-800 dark:text-gray-200"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2">
                        Password
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring focus:ring-indigo-200 transition duration-300 dark:bg-gray-800 dark:text-gray-200"
                    />
                </div>

                <div className="mt-6">
                    {signup ? (
                        <button
                            onClick={() => {
                                func && func(userName, email, password);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                        >
                            Signup
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                loginFunc && loginFunc(email, password);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-300"
                        >
                            Login
                        </button>
                    )}
                </div>

                <div className="text-center mt-4">
                    <p className="text-gray-600 dark:text-gray-300">
                        {signup
                            ? "Already have an account?"
                            : "Don't have an account yet?"}
                        <Link href={signup ? "/login" : "/signup"}>
                            <span className="text-blue-500 hover:underline ml-2">
                                {signup ? "Login" : "Sign Up"}
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
