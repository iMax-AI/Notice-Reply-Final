import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { pdfLink } = await request.json();
    const storage = new Storage({ keyFilename: './key.json' });
    
    const fullPath = pdfLink.replace('https://storage.googleapis.com/notice-reply/', '');
    const bucket = storage.bucket('notice-reply');
    const file = bucket.file(fullPath);
    
    const [signedUrl] = await file.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000
    });
    
    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}