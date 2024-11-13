"use client"

import { db } from '@/firebase/firebseConfig';
import { CardData } from '@/type/type';
import { CircularProgress } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react'
import Markdown from 'react-markdown';

export default function ShowBlogs() {
    const [allCards, setAllCards] = useState<CardData[]>([])
    const [selectedTag, setSelectedTag] = useState('All');
    const [loading, setLoading] = useState(false);


    // Extract unique tags
    const tags = useMemo(() => {
        const uniqueTags = new Set(allCards.map(card => card.tag));
        return ['All', ...Array.from(uniqueTags)];
    }, [allCards]);

    // Filter cards based on selected tag
    const filteredCards = useMemo(() => {
        if (selectedTag === 'All') return allCards;
        return allCards.filter(card => card.tag === selectedTag);
    }, [allCards, selectedTag]);


    useEffect(() => {
        async function getData() {
            try {
                setLoading(true)
                const querySnapshot = await getDocs(collection(db, "blogs"));
                const dataArray: CardData[] = [];
                querySnapshot.forEach((doc) => {
                    dataArray.push(doc.data() as CardData);
                });
                setAllCards(dataArray);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false)
            }
        }
        getData();
    }, []);


    return (
        <>
            {
                loading && <CircularProgress color='success' className='absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]' />
            }
            <section className="products">
                <div className="pro-heading">
                    <div className="content">
                        <h2>BLogs</h2>
                        <h2>BLogs</h2>
                    </div>
                </div>
                <div className="product-list">
                </div>
            </section>
            <div className="container mx-auto px-4 py-8">
                {/* Tag Filter UI */}
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Filter by Tag:</h3>
                    <div className="flex flex-wrap gap-3">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => setSelectedTag(tag!)}
                                className={`px-4 py-2 rounded-full border transition 
                ${selectedTag === tag
                                        ? 'bg-teal-600 text-white border-teal-600'
                                        : 'bg-white text-teal-600 border-teal-600 hover:bg-teal-600 hover:text-white'
                                    }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Cards Grid */}
                {filteredCards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCards.map(({ firebaseID, imageUrl, title, text, tag }) => (
                            <div
                                key={firebaseID}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
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
                                <div className="p-6 relative h-[300px]">
                                    <div className="text-teal-600 text-sm font-medium mb-2 border w-fit px-4 py-1 rounded-full border-teal-600">
                                        {tag}
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4">{title}</h2>
                                    <div className="text-gray-700">
                                        <Markdown>
                                            {text!.length > 150 ? `${text!.substring(0, 150)}...` : text}
                                        </Markdown>
                                    </div>
                                    <Link
                                        href={`/blog/${firebaseID}`}
                                        className="inline-block mt-4 text-teal-600 hover:underline font-semibold absolute bottom-4 left-4"
                                    >
                                        Read More
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No cards found for the selected tag.</p>
                )}
            </div>
        </>
    )
}
