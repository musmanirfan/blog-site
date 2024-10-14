"use client"

import Header from "@/components/header";
import ShowBlogs from "@/components/showBlogs";
import { useState } from "react";


export default function Home() {
  
  return (
    <div>
      <Header/*  setReload={setReload} *//>
      <ShowBlogs />
    </div>
  );
}
