// This function converts a binary file (image, video, audio, or PDF) to a DNA sequence.
export default async function convertToDNA(src: string, onComplete: ()=> void) {
    if (!src) {
        console.error('No source provided');
        return;
    }

    try {
        const response = await fetch(src);
        if (!response.ok) {
            throw new Error('Failed to fetch the file:');
        }

        const contentType = response.headers.get('Content-Type') || '';
        const validTypes = ['image/', 'video/', 'audio/', 'application/pdf'];

        if (!validTypes.some(type => contentType.startsWith(type))) {
            console.error('Invalid file type:', contentType);
            return;
        }

        const arrayBuffer = await response.arrayBuffer();
        const uint8 = new Uint8Array(arrayBuffer);

        console.log("Converting binary to DNA...");

        const binaryString = [...uint8]
            .map(byte => byte.toString(2).padStart(8, '0'))
            .join('');

        const dnaString = binaryString.match(/.{1,2}/g)?.map(bits => {
            switch (bits) {
                case '00': return 'A';
                case '01': return 'T';
                case '10': return 'C';
                case '11': return 'G';
                default: return '';
            }
        }).join('');

        console.log("Conversion complete!");
        console.log("DNA Output (first 500 chars):");
        console.log(dnaString?.slice(0, 500) + '...');

        // Call the onComplete function after conversion
        if (onComplete) {
            onComplete();
        }

        return dnaString;
    } catch (error) {
        console.error("Error during DNA conversion:", error);
    }
}