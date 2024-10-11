"use client"

import { db } from '@/firebase/firebseConfig';
import { CardData } from '@/type/type';
import { collection, getDocs } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

export default function ShowBlogs() {
    const [allCards, setAllCards] = useState<CardData[]>([])
    const [imageURL, setImageURL] = useState<string | null>(null);
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
    return (
        allCards.length > 0 ? (
            <div>
                {allCards.map(({ firebaseID, imageUrl, title, mark, tag, slug }) => (
                    <div key={firebaseID}>
                        <Image width={50} height={50} src={imageUrl!} alt="Picture of the author" />
                        <p>{title}</p>
                        <p>{tag}</p>
                        <p>{mark}</p>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex justify-center items-center">
                <p>loading</p>
            </div>
        )
    )
}
