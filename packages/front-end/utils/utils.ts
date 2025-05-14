export function encodeBase64(input: string): string {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
        // Browser-side encoding (btoa works in browsers)
        return btoa(input);
    } else {
        // Server-side encoding using Buffer (works in Node environments)
        return Buffer.from(input, 'utf-8').toString('base64');
    }
}

export function decodeBase64(input: string): string {
    if (typeof window !== 'undefined' && typeof window.atob === 'function') {
        // Browser-side decoding
        return atob(input);
    } else {
        // Server-side decoding using Buffer
        return Buffer.from(input, 'base64').toString('utf-8');
    }
}

export function formatKeywords(value : any): string {
    if (Array.isArray(value)) {
      return value.join(', '); // Convert array to comma-separated string
    } else if (typeof value === 'string') {
      return value; // Return string as is
    } else {
      return '-'; // Return "-" for null or other types
    }
}

export function formatKeywordsForQueryParam(value : any): string {
    if (Array.isArray(value)) {
      return value.join(','); // Convert array to comma-separated string
    } else if (typeof value === 'string') {
      return value; // Return string as is
    } else {
      return '-'; // Return "-" for null or other types
    }
}


export function formatImages(value: any): Array<string> {
    console.log("value",value)
    if (Array.isArray(value)) {
        return value;
    } else if(typeof value === 'string') {
        return [value];
    } else {
        return [];
    }
}

export function getFileNameAndFileType(filename: string): { fileName: string; fileType: string } {
    const lastDotIndex = filename.lastIndexOf(".");

    if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
        throw new Error("Invalid filename: no valid file extension found.");
    }

    const fileName = filename.substring(0, lastDotIndex); // Extract name before last dot
    const fileType = filename.substring(lastDotIndex + 1); // Extract extension after last dot

    return { fileName, fileType };
}
