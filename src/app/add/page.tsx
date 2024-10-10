"use client"

import { auth, db, storage } from '@/firebase/firebseConfig';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from 'react-toastify';
import { makeName } from '../additionalfunction/makeName';
import { metadata } from '../additionalfunction/metaData';
import { makeSlug } from '../additionalfunction/makeSlug';
import { useRouter } from 'next/navigation';

export default function Add() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<null | File>(null);
    const [tag, setTag] = useState("");
    const [text, setText] = useState("")
    const route = useRouter()

    const uploadImg = (): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!file) return reject("No file to upload");
            console.log(file);
            let newName = makeName(file.name);
            const storageRef = ref(storage, `images/${newName}`);
            const uploadTask = uploadBytesResumable(storageRef, file, metadata);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

    const add = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(title, file, tag, text);
        const uid = auth.currentUser?.uid;
        if (!uid) {
            toast.error("User is not authenticated!");
            return;
        }

        const collectionRef = collection(db, "blogs");

        try {
            const imageUrl = await uploadImg();
            const slug = makeSlug(title);
            const newBlog = { title, tag, text, uid, imageUrl, slug };
            const docRef = await addDoc(collectionRef, newBlog);
            const docRefToUpdate = doc(db, "blogs", docRef.id);
            await updateDoc(docRefToUpdate, { firebaseID: docRef.id });
            toast.success("Blog Added Successfully!");
            route.push("/")
        } catch (e) {
            console.log(e);
        }
    };



    return (
        <div className="max-w-lg mx-auto my-10 p-6 bg-[#EBEBEB] rounded-md shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Add a New Blog Post</h2>
            <form onSubmit={add}>
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
                    Add
                </button>
            </form>
        </div>
    )
}
