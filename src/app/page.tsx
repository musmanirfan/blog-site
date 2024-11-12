"use client"


import Header from "@/components/header";
import ShowBlogs from "@/components/showBlogs";
import { auth } from "@/firebase/firebseConfig";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import Footer from "@/components/footer";


export default function Home() {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User sign in hai
        console.log('User is signed in:', user.uid);
      } else {
        // User sign out hai
        console.log('No user is signed in.');
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [auth]);

  return (
    <div>
      <Header />
      <ShowBlogs />
      <Footer />
    </div>
  );
}
