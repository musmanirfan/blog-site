"use client"
import { useRouter, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from '@/firebase/firebseConfig';
import { toast } from 'react-toastify';
import { User } from '@/type/type';
import { Save } from '@mui/icons-material';

export default function Header() {
    const [reload, setReload] = useState(false);
    const [user, setUser] = useState<User | null>(null)
    const route = useRouter();
    const path = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser as User)
        })
        return () => unsubscribe();
    }, [])


    const logoutFunc = () => {
        console.log("logout1");
        signOut(auth).then(() => {
            toast.success("LogOut Successfully")
            setReload(true);
            console.log("logout");
            if (path === "/add") {
                route.push("/");
            } else {
                route.push(path)
            }
        }).catch((error) => {
            console.log(error);
            console.log(reload);
        });
    }



    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* <!-- Website Name --> */}
                <h1 className="text-2xl font-bold">My Website</h1>

                {/* <!-- Add Blog and Logout Buttons --> */}
                <div className="flex space-x-4 flex-row">
                    {user && (
                        <div className='flex flex-row gap-3'>
                            <div onClick={() => route.push("/save")} className='w-fit flex justify-center items-center cursor-pointer'>
                                <Save fontSize="large" />
                            </div>
                            <button onClick={() => { route.push("/add") }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 whitespace-nowrap rounded">
                                Add Blog
                            </button>
                        </div>
                    )
                    }
                    {
                        user ? (
                            <button onClick={logoutFunc}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            >
                                logOut
                            </button>
                        ) : (
                            <button onClick={() => { route.push("/signup") }}
                                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                            >
                                sign Up
                            </button>
                        )
                    }
                </div>
            </div>
        </header >
    )
}
