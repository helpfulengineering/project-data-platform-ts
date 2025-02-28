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