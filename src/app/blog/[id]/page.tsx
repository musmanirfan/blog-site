"use client"

import { formatDate } from '@/app/additionalfunction/formatDate';
import Header from '@/components/header';
import { auth, db } from '@/firebase/firebseConfig';
import { BlogData, Comment } from '@/type/type';
import { CircularProgress } from '@mui/material';
import { Save } from '@mui/icons-material';
import { addDoc, collection, getDocs, onSnapshot, query, serverTimestamp, where } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import { toast } from 'react-toastify';
import Footer from '@/components/footer';

export default function Page({ params }: { params: { id: string } }) {
    const [data, setData] = useState<BlogData | null>(null);
    const [comment, setComment] = useState("");
    const [showComments, setShowComments] = useState<Comment[]>([]);
    const { id } = params
    const currentBlogId = id;


    useEffect(() => {
        if (!currentBlogId) return;

        const commentsRef = collection(db, "Comment");
        const q = query(
            commentsRef,
            where("blogId", "==", currentBlogId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsList: Comment[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data()
                if (data.blogId && data.uid && data.createdAt && data.comment) {

                    commentsList.push({
                        blogId: data.blogId,
                        uid: data.uid,
                        createdAt: data.createdAt,
                        comment: data.comment,
                    });
                }
            });
            // Assuming you have a state to hold comments
            setShowComments(commentsList);
        }, (error) => {
            console.error("Error fetching comments: ", error);
        });

        return () => unsubscribe();
    }, [currentBlogId]);




    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value)
    }

    const addComment = async () => {
        const uid = auth.currentUser?.uid;
        const createdAt = serverTimestamp();
        if (!uid) {
            toast.error("User is not authenticated!");
            return;
        }
        const collectionRef = collection(db, "Comment");
        try {
            const newComment = { uid, createdAt, blogId: id, comment };
            await addDoc(collectionRef, newComment);
            setComment("")
        } catch (e) {
            console.log(e);
        }
    };


    const saveBlog = async () => {
        const uid = auth.currentUser?.uid;
        const createdAt = serverTimestamp();
        if (!uid) {
            toast.error("User is not authenticated!"); return;
        }
        const collectionRef = collection(db, "saveBlogs");
        try {
            const newBlogSave = { blogId: id, createdAt, uid };
            await addDoc(collectionRef, newBlogSave);
            console.log("blog save");
            toast.success('Blog Save successfully!');

        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (id) {
            console.log("start");

            (async () => {
                try {
                    const q = query(collection(db, "blogs"), where("firebaseID", "==", id))
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
    }, [id])
    return (
        <>
            <Header />
            <div className='flex justify-center'>
                {
                    data ? (
                        <div className=" !w-[700px] overflow-x-hidden">
                            <div className="bg-white shadow-lg rounded-lg !w-[100%] overflow-x-hidden">
                                <Image
                                    className="object-cover w-[100%] sm:w-full h-64"
                                    src={data.imageUrl!}
                                    alt={data.title!}
                                    width={800}
                                    height={400}
                                    unoptimized
                                />
                                <div className="p-6">
                                    <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
                                    <div onClick={saveBlog} className='w-fit cursor-pointer'>
                                        <Save />
                                    </div>
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
                                        </ReactMarkdown>
                                    </div>
                                    <div>
                                        <textarea value={comment} onChange={handleInputChange} className='border border-1 mt-5 sm:w-[1200px] !pr-2 ' name="Comment" id="comment" placeholder=' Comment...' cols={80} rows={3} />

                                        {comment.trim() !== "" && (
                                            <button onClick={addComment} className="bg-green-500 hover:bg-green-600 text-white w-full font-bold py-2 px-4 rounded transition-all delay-500">
                                                Post
                                            </button>
                                        )
                                        }
                                    </div>
                                    <div className="mt-6">
                                        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
                                        {showComments.length === 0 ? (
                                            <p>No comments yet. Be the first to comment!</p>
                                        ) : (
                                            <ul>
                                                {showComments.map((cmt) => (
                                                    <li key={cmt.blogId} className="mb-4 p-4 bg-gray-100 rounded">
                                                        <h1>
                                                            {cmt.comment}
                                                        </h1>
                                                        <p className='text-xs'>

                                                            {cmt.createdAt && (
                                                                <em> ({cmt.createdAt.toDate().toLocaleString()})</em>
                                                            )}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
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
            <Footer />
        </>
    )
}
