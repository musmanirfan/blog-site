"use client"

import { formatDate } from '@/app/additionalfunction/formatDate';
import Header from '@/components/header';
import { db } from '@/firebase/firebseConfig';
import { BlogData } from '@/type/type';
import { CircularProgress } from '@mui/material';
import { collection, DocumentData, getDocs, query, where } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';

export default function Page({ params }: { params: { slug: string } }) {
    const [data, setData] = useState<BlogData | null>(null);

    useEffect(() => {
        if (params.slug) {
            (async () => {
                try {
                    const q = query(collection(db, "blogs"), where("slug", "==", params.slug))
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        const docData = doc.data() as BlogData;
                        setData(docData);
                    })
                } catch (e) {
                    console.log(e);
                }
            })()
        }
    }, [params.slug])
    return (
        <>
            <Header />
            <div className='flex w-[100%] justify-center mx-auto'>
                {
                    data ? (
                        <div className="max-w-screen-md mx-auto p-6">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <Image
                                    className="object-cover w-full h-64"
                                    src={data.imageUrl!}
                                    alt={data.title!}
                                    width={800}
                                    height={400}
                                    unoptimized
                                />
                                <div className="p-6">
                                    <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                                    <p className="text-sm text-gray-500 mb-2">{formatDate(data)}</p>
                                    {data.tag && (
                                        <div className="mb-4">
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                {data.tag}
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-gray-700 leading-relaxed prose">
                                        <ReactMarkdown>
                                            {data.text}
                                        </ReactMarkdown> </div>
                                </div>
                            </div>
                        </div>

                    ) : (
                        <div className='justify-center mt-2'>
                            <CircularProgress color='success' />
                        </div>
                    )
                }
            </div>
        </>
    )
}
