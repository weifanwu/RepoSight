import { MarkerType } from '@xyflow/react';

export const initialNodes = [
  { id: 'root', type: 'input', data: { label: 'Root' }, position: { x: 0, y: 0 } },
  { id: 'folder1', data: { label: 'Folder 1' }, position: { x: 100, y: 100 } },
  { id: 'file1', data: { label: 'File 1' }, position: { x: 100, y: 200 } },
  { id: 'file2', data: { label: 'File 2' }, position: { x: 100, y: 300 } },
  { id: 'folder2', data: { label: 'Folder 2' }, position: { x: 300, y: 100 } },
  { id: 'file3', data: { label: 'File 3' }, position: { x: 300, y: 200 } },
  { id: 'file4', data: { label: 'File 4' }, position: { x: 300, y: 300 } },
];

export const initialEdges = [
  { id: 'e10', source: 'root', target: 'folder1', animated: true, markerEnd: { type: MarkerType.Arrow } },
  { id: 'e11', source: 'root', target: 'folder2', animated: true, markerEnd: { type: MarkerType.Arrow } },
  { id: 'e12', source: 'folder1', target: 'file1', animated: true, markerEnd: { type: MarkerType.Arrow } },
  { id: 'e13', source: 'folder1', target: 'file2', animated: true, markerEnd: { type: MarkerType.Arrow } },
  { id: 'e24', source: 'folder2', target: 'file3', animated: true, markerEnd: { type: MarkerType.Arrow } },
  { id: 'e25', source: 'folder2', target: 'file4', animated: true, markerEnd: { type: MarkerType.Arrow } },
];