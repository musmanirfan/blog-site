"use client"

import { makeName } from '@/app/additionalfunction/makeName'
import { metadata } from '@/app/additionalfunction/metaData'
import Header from '@/components/header'
import { db, storage } from '@/firebase/firebseConfig'
import { CircularProgress } from '@mui/material'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { toast } from 'react-toastify'

export default function EditBlog({ params }: { params: { id: string } }) {

    const route = useRouter()
    const { id } = params

    const [title, setTitle] = useState('');
    const [file, setFile] = useState<null | File>(null);
    const [tag, setTag] = useState('');
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchBlog = async () => {
            const docRef = doc(db, "blogs", id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setTitle(data.title);
                setTag(data.tag);
                setText(data.text);
                setImageUrl(data.imageUrl);
                setLoading(false);
            } else {
                toast.error("Blog not found");
                route.push('/admin');
            }
        };

        if (id) {
            fetchBlog();
        }
    }, [id, route]);

    const uploadImg = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!file) return resolve(imageUrl);
            console.log(file);
            const newName = makeName(file.name);
            const storageRef = ref(storage, `images/${newName}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    return progress;

                },
                (error) => {
                    reject(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log("File available at", downloadURL);
                    resolve(downloadURL);
                    getDownloadURL(uploadTask.snapshot.ref)
                        .then((downloadURL) => {
                            console.log("File available at", downloadURL);
                            resolve(downloadURL);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                }
            );
        });
    };

    const updateBlog = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const newImageUrl = await uploadImg();

            const docRef = doc(db, 'blogs', id as string);
            await updateDoc(docRef, {
                title,
                tag,
                text,
                imageUrl: newImageUrl,
            });

            toast.success('Blog updated successfully!');
            route.push('/admin'); // Ya jahaan redirect karna ho
        } catch (e) {
            console.log(e);
            toast.error('Failed to update blog');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[100vh]">
                <CircularProgress color='success' />
            </div>
        )
    }


    return (
        <>
            <Header />
            <div className="max-w-lg mx-auto my-10 p-6 bg-[#EBEBEB] rounded-md shadow-lg">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Update Blog Post</h2>
                <form onSubmit={updateBlog}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="file" className="block text-gray-700 font-medium mb-2">File:</label>
                        <input
                            type="file"
                            id="file"
                            onChange={e => setFile(e.target.files?.[0] ?? null)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="tag" className="block text-gray-700 font-medium mb-2">Tag:</label>
                        <select
                            id="tag"
                            value={tag}
                            onChange={e => setTag(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Entertainment">Entertainment</option>
                            <option value="Education">Education</option>
                            <option value="Coding">Coding</option>
                            <option value="Blogging">Blogging</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="text" className="block text-gray-700 font-medium mb-2">Text:</label>
                        <textarea
                            id="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-200"
                    >
                        Update
                    </button>
                    <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between md:w-full border border-gray-200 text-black max-h-[100%] mt-3 overflow-y-scroll">
                        <label htmlFor="tag" className="block text-sm font-bold mb-2">
                            <span className="text-neutral">Text Output:</span>
                        </label>
                        <div className="p-2 h-full ">
                            <ReactMarkdown className="rounded-lg prose">
                                {text}
                            </ReactMarkdown>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
