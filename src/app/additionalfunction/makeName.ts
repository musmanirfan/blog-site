export const makeName = (fileName: string): string => {
    let fileNameArr = fileName.split(".");
    let lastIndex = fileNameArr.length - 1;
    let fileExtension = fileNameArr[lastIndex];
    let newName = `${crypto.randomUUID()}.${fileExtension}`;
    return newName;
};