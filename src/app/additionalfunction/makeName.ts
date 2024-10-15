export const makeName = (fileName: string): string => {
    const fileNameArr = fileName.split(".");
    const lastIndex = fileNameArr.length - 1;
    const fileExtension = fileNameArr[lastIndex];
    const newName = `${crypto.randomUUID()}.${fileExtension}`;
    return newName;
};