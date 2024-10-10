"use client"

import { auth, db, storage } from '@/firebase/firebseConfig';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from 'react-toastify';
import { resolve } from 'path';

export default function Add() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<null | File>(null);
    const [tag, setTag] = useState("");
    const [text, setText] = useState("")
    const [imageURL, setImageURL] = useState("")


    const add = async () => {
        console.log(title, file, tag, text);
        const uid = auth.currentUser?.uid;
        if (!uid) {
            toast.error("User is not authenticated!");
            return
        }

        const collectionRef = collection(db, "blogs")

        try {
            const metadata = {
                contentType: 'image/jpeg'
            };
            const makeName = (fileName: string): string => {
                let fileNameArr = fileName.split(".")
                let lastIndex = fileNameArr.length - 1;
                let fileExtension = fileNameArr[lastIndex];
                let newName = `${crypto.randomUUID()}.${fileExtension}`;
                return newName;
            }
            const uploadImg = async () => {
                if (!file) return
                console.log(file);
                let newName = makeName(file.name);
                const storageRef = ref(storage, `images/${newName}`);
                const uploadTask = uploadBytesResumable(storageRef, file, metadata);
                uploadTask.on('state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        switch (error.code) {
                            case 'storage/unauthorized':
                                break;
                            case 'storage/canceled':
                                break;
                            case 'storage/unknown':
                                break;
                        }
                    },
                    async () => {
                        // Upload completed successfully, now we can get the download URL
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        console.log("File available at", downloadURL);
                        resolve(downloadURL);
                    }
                );
            }
        } catch (e) {
            console.log(e);

        }
    }


    return (
        <div>
            <label htmlFor="title">Title:
                <input type="text" value={title} id='title' onChange={e => setTitle(e.target.value)} />
            </label>
            <label htmlFor="file">File:
                <input type="file" id='file' onChange={e => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <label htmlFor="tag">Tag:
                <select name="tag" defaultValue={tag} id="tag" onChange={e => setTag(e.target.value)}>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Education">Education</option>
                    <option value="Coding">Coding</option>
                    <option value="Blogging">Blogging</option>
                </select>
            </label>
            <label htmlFor="text">Text:
                <textarea value={text} id='text' onChange={e => setText(e.target.value)} />
            </label>
            <button onClick={add}>Add</button>
        </div>
    )
}
