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