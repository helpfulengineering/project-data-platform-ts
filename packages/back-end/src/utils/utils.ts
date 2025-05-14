export function getFileNameAndFileType(filename: string): { fileName: string; fileType: string } {
    const lastDotIndex = filename.lastIndexOf(".");

    if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
        throw new Error("Invalid filename: no valid file extension found.");
    }

    const fileName = filename.substring(0, lastDotIndex); // Extract name before last dot
    const fileType = filename.substring(lastDotIndex + 1); // Extract extension after last dot

    return { fileName, fileType };
}
