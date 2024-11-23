import { NextRequest, NextResponse } from 'next/server';
import { convertFilesToNodesAndEdges } from '@/utils/convertToNodes';

export const config = {
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: false,
    },
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const files = formData.getAll('files').filter((entry): entry is File => entry instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ message: 'No files provided' }, { status: 400 });
    }

    const nodesAndEdges = convertFilesToNodesAndEdges(files);

    return NextResponse.json({
      message: 'Files uploaded successfully',
      nodesAndEdges: nodesAndEdges,
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { message: 'File upload failed' },
      { status: 500 },
    );
  }
}
