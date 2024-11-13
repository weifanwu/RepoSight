import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files'); // Get all files with the key 'files'

    // Iterate over each file and log its details
    files.forEach((file, index) => {
      if (file instanceof File) {
        console.log(`File #${index + 1}:`);
        console.log(`Name: ${file.name}`);
        console.log("");
      }
    });

    return NextResponse.json({ message: 'Files uploaded successfully' });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ message: 'File upload failed' }, { status: 500 });
  }
}