"use client"

import { db } from '@/firebase/firebseConfig';
import { CardData } from '@/type/type';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

export default function ShowBlogs() {
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
    return (
        {
            allCards.length > 0 ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-5 my-5">
                        {filteredCards.map(
                            ({ firebaseID, imageURL, title, mark, tag, slug }) => {
                                return (
                                    <Cards
                                        key={firebaseID}
                                        imageURL={imageURL}
                                        heading={title}
                                        text={mark}
                                        tag={tag}
                                        slug={slug}
                                    />
                                );
                            }
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center">
                    <p>loading</p>
                </div>
            )
        }
    )
}
