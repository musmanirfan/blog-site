"use client"

import { auth, db } from '@/firebase/firebseConfig';
import { collection } from 'firebase/firestore';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

export default function Add() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<null | File>(null);
    const [tag, setTag] = useState("");
    const [text, setText] = useState("")


    const add = async () => {
        console.log(title, file, tag, text);
        const uid = auth.currentUser?.uid;
        if (!uid) {
            toast.error("User is not authenticated!");
            return
        }
        const collectionRef = collection(db, "blogs")
        try {
            const uploadImg = async () => { 
                if(!file) return
                console.log(file);
                const imgRef = ref(Storage, `uploads/images${Date.now()}-${file.name}`)
                
                
            }
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
