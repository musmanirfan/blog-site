"use client"

import { useAuthContext } from '@/context/authContext';
import { auth, db } from '@/firebase/firebseConfig';
import { CardData } from '@/type/type';
import { CircularProgress } from '@mui/material';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Markdown from 'react-markdown';

export default function Save() {
  const [savedBlogs, setSavedBlogs] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuthContext()!


  useEffect(() => {

    const fetchSaveBlogs = async () => {
      const uid = user?.uid
      if (!uid) {
        console.log("user not authenticated");
        setLoading(false);
        return
      }
      try {
        const saveBlogRef = collection(db, "saveBlogs");
        const saveBlogsQuery = query(saveBlogRef, where("uid", "==", uid))


        const unsubscribe = onSnapshot(saveBlogsQuery, async (saveBlogsSnapshot) => {
          const blogIds = saveBlogsSnapshot.docs.map(doc => doc.data().blogId);
          if (blogIds.length === 0) {
            setSavedBlogs([]);
            setLoading(false);
            return
          }

          const blogRef = collection(db, "blogs");
          const blogsQuery = query(blogRef, where("firebaseID", "in", blogIds));
          const blogsSnapshot = await getDocs(blogsQuery);

          const blogsData = blogsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as CardData[];
          setSavedBlogs(blogsData)
          setLoading(false)
          return () => unsubscribe();
        })
      } catch (e) {
        console.log(e);
      }
    }
    fetchSaveBlogs();
  }, [])

  if (loading) {
    return <div className='flex justify-center mt-4'>
      <CircularProgress color='success' />
    </div>;
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
      {savedBlogs.map(({ firebaseID, imageUrl, title, text, tag }) => (
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
          <div className="p-6 relative h-[300px]">
            <div className="text-teal-600 text-sm font-medium mb-2 border w-fit px-4 py-1 rounded-full border-teal-600">
              {tag}
            </div>
            <h2 className="text-2xl font-bold mb-4">
              {title}
            </h2>
            <div className="text-gray-700">
              <Markdown>
                {text!.length > 150 ? `${text!.substring(0, 150)}...` : text}
              </Markdown>
            </div>
            <Link href={`/blog/${firebaseID}`} className="inline-block mt-4 text-teal-600 hover:underline font-semibold  absolute bottom-4 left-4">
              Read More
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
