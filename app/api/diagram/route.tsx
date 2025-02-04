import { NextRequest, NextResponse } from 'next/server';
import { convertFilesToHierarchyWithTree } from '@/utils/convertToNodes';

// Handles POST requests to convert file paths to a hierarchy and return nodes and edges
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const filePaths: string[] = body.filePaths;

    if (!filePaths || filePaths.length === 0) {
      return NextResponse.json({ message: "No file paths provided" }, { status: 400 });
    }

    const nodesAndEdges = convertFilesToHierarchyWithTree(filePaths);
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
