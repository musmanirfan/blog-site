export function makeSlug(title: string) {
    return (
        title
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
    );
}