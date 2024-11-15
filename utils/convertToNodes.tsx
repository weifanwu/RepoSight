import { MarkerType } from '@xyflow/react';

type Node = {
  id: string;
  data: { label: string };
  position: { x: number; y: number };
  type?: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  markerEnd?: { type: MarkerType };
};

export function convertFilesToNodesAndEdges(files: File[]): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const positionMap: Record<string, { x: number; y: number }> = {}; // Track positions
  const nodeIds = new Set<string>(); // Track unique node IDs
  let yOffset = 0; // Y-offset for positioning

  files.forEach((file) => {
    const pathParts = file.webkitRelativePath
      ? file.webkitRelativePath.split('/')
      : file.name.split('/');

    // Exclude paths containing "node_modules"
    if (pathParts.includes('node_modules')) return;

    pathParts.forEach((part, index) => {
      const nodeId = pathParts.slice(0, index + 1).join('/');
      
      if (!nodeIds.has(nodeId)) {
        nodeIds.add(nodeId);
        
        // Determine label and position
        const isFolder = index < pathParts.length - 1;
        const label = isFolder ? `Folder: ${part}` : `File: ${part}`;
        
        const node: Node = {
          id: nodeId,
          data: { label },
          position: { x: index * 200, y: yOffset },
          type: isFolder ? 'default' : 'output', // Folder or file node type
        };
        
        nodes.push(node);
        
        if (index > 0) {
          const parentId = pathParts.slice(0, index).join('/');
          edges.push({
            id: `e-${parentId}-${nodeId}`,
            source: parentId,
            target: nodeId,
            animated: true,
            markerEnd: { type: MarkerType.Arrow },
          });
        }
        
        yOffset += 100; // Increment position for each new node
      }
    });
  });

  return { nodes, edges };
}