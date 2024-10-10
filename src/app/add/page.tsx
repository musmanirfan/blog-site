"use client"

import React, { useState } from 'react'

export default function Add() {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<null | File>(null);
    const [tag, setTag] = useState("");
    const [text, setText] = useState("")


    const add = () => {
        console.log(title, file, tag, text);
        
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
