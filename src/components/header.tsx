"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { signOut } from "firebase/auth";
import { auth } from '@/firebase/firebseConfig';
import { toast } from 'react-toastify';

export default function Header() {
    const route = useRouter()
    const logoutFunc = () => {
        console.log("logout1");
        signOut(auth).then(() => {
            toast.success("LogOut Successfully")
            console.log("logout");

        }).catch((error) => {
            console.log(error);

        });

    }



    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* <!-- Website Name --> */}
                <h1 className="text-2xl font-bold">My Website</h1>

                {/* <!-- Add Blog and Logout Buttons --> */}
                <div className="flex space-x-4">
                    <button onClick={() => { route.push("/add") }} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Add Blog
                    </button>
                    <button onClick={logoutFunc} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                        Logout
                    </button>
                </div>
            </div>
        </header>
    )
}
