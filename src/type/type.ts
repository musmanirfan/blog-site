import { Timestamp } from "firebase/firestore";

export type signupType = {
    signup?: boolean,
    func?: (userName: string, email: string, password: string) => void
    loginFunc?: (email: string, password: string) => void
}

export type User = {
    displayName?: string;
    email?: string;
    password?: string
    uid?: string
}


export type addType = {
    title: string;
    file: File | null | undefined;
    tag: string;
    text: string;
    slug: string;
    createdDate: Date;
}

export type CardData = {
    firebaseID?: string;
    imageUrl?: string;
    title?: string;
    mark?: string;
    tag?: string;
    slug?: string;
    text?: string;
};

export interface BlogData {
    imageUrl: string;
    title: string;
    slug: string;
    createdDate: Timestamp;
    text: string;
    tag: string;
    // Add other fields as necessary
}

