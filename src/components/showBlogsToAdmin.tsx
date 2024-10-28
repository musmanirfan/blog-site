"use client"

import { db } from '@/firebase/firebseConfig';
import { CardData } from '@/type/type';
import { Delete, Edit } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown';
import { toast } from 'react-toastify';

export default function ShowBlogsToAdmin() {
    const [allCards, setAllCards] = useState<CardData[]>([])
    useEffect(() => {
        async function getData() {
            const querySnapshot = await getDocs(collection(db, "blogs"));
            const dataArray: CardData[] = [];
            querySnapshot.forEach((doc) => {
                dataArray.push(doc.data() as CardData);
            });
            setAllCards(dataArray);
        }
        getData();
    }, []);

    const handleDeleteBlog = async (firebseID: string) => {
        try {
            const blogRef = doc(db, "blogs", firebseID);
            await deleteDoc(blogRef);
            console.log("Blog deleted successfully.");
            toast.success("Blog Delete Successfully", {
            });
        } catch (error) {
            console.log("Error deleting expense:", error);
        }
    };



    return (
        allCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
                {allCards.map(({ firebaseID, imageUrl, title, text, tag, slug }) => (
                    <div key={firebaseID} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <div className="relative w-full h-64">
                            <Image
                                className="object-cover w-full h-full"
                                src={imageUrl!}
                                alt={title!}
                                width={800}
                                height={400}
                                unoptimized
                            />
                        </div>
                        <div className="p-6 h-[300px] relative">
                            <div className="text-teal-600 text-sm font-medium mb-2 border w-fit px-4 py-1 rounded-full border-teal-600">
                                {tag}
                            </div>
                            <h2 className="text-2xl font-bold mb-4">
                                {title}
                            </h2>
                            {/* <h2 className="text-2xl font-bold mb-4">
                                {firebaseID}
                            </h2> */}
                            <div className="text-gray-700">
                                <Markdown>
                                    {text!.length > 150 ? `${text!.substring(0, 150)}...` : text}
                                </Markdown>
                            </div>
                            <div className='flex justify-between items-center absolute bottom-4 left-4 right-4'>
                                <Link href={`/blog/${slug}`} className="inline-block mt-4 text-teal-600 hover:underline font-semibold">
                                    Read More
                                </Link>
                                <div className='flex'>
                                    <Link href={`admin/edit/${firebaseID}`}>
                                        <Edit className='cursor-pointer' />
                                    </Link>
                                    <div className='cursor-pointer' onClick={() => { handleDeleteBlog(firebaseID as string) }}>
                                        <Delete />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex justify-center items-center h-[100vh]">
                <CircularProgress color='success' />
            </div>
        )
    )
}
