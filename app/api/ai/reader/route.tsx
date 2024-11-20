import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {

    return NextResponse.json({ message: 'Files uploaded successfully', content: "repo is used to do some machine learning training"});

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ message: 'File upload failed' }, { status: 500 });
  }
}