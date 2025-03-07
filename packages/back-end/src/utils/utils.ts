export function getFileNameAndFileType(filename: string): { fileName: string; fileType: string } {
    const lastDotIndex = filename.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return { fileName: filename, fileType: "" }; // No extension found
    }

    const fileName = filename.substring(0, lastDotIndex); // Extract name before last dot
    const fileType = filename.substring(lastDotIndex + 1); // Extract extension after last dot

    return { fileName, fileType };
}