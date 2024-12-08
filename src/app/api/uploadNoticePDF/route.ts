import { Storage } from '@google-cloud/storage';
import prisma from "@/lib/prisma";
import { Readable } from "stream";

const storage = new Storage({ keyFilename: './key.json' });
const bucketName = 'notice-reply';

function webStreamToAsyncIterable<T>(stream: ReadableStream<T>): AsyncIterable<T> {
    const reader = stream.getReader();
    return {
        async *[Symbol.asyncIterator]() {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                yield value;
            }
        },
    };
}


export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const userId = formData.get('userId') as string | null;

        if (!file || !userId) {
            return new Response(
                JSON.stringify({ success: false, message: 'No Data received' }),
                { status: 400 }
            );
        }

        const destinationPath = `${userId}/${file.name}`;
        const bucket = storage.bucket(bucketName);

        const readableStream = Readable.from(webStreamToAsyncIterable(file.stream()));

        const gcsFile = bucket.file(destinationPath);
        await new Promise((resolve, reject) => {
            readableStream
                .pipe(gcsFile.createWriteStream({
                    resumable: false,
                    contentType: file.type || 'application/octet-stream',
                }))
                .on('finish', resolve)
                .on('error', reject);
        });

        const fileUrl = `https://storage.googleapis.com/${bucketName}/${destinationPath}`;

        await prisma.userActivity.create({
            data: {
                userId: userId,
                pdf_hosted_link: fileUrl,
                pdf_name: file.name
            },
        });

        return new Response(
            JSON.stringify({ success: true, message: 'File uploaded successfully', url: fileUrl }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error Uploading File to GCP:', error);
        return new Response(
            JSON.stringify({ success: false, message: 'Error Uploading File to GCP' }),
            { status: 500 }
        );
    }
}