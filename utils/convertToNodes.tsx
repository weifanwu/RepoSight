import { MarkerType, Node, Edge } from '@xyflow/react';

export function convertFilesToNodesAndEdges(files: File[]): { nodes: Node[]; edges: Edge[]; serializableTree: [string, string[]][] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeIds = new Set<string>(); // Track unique node IDs
  let yOffset = 0; // Y-offset for positioning
  const tree: Map<string, Set<string>> = new Map();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const pathParts = file.webkitRelativePath
      ? file.webkitRelativePath.split('/')
      : file.name.split('/');
  
    // Exclude paths containing "node_modules" or starting with "."
    if (pathParts.some((part) => part.startsWith('.') || part === 'node_modules')) {
      continue;
    }
  
    for (let index = 0; index < pathParts.length; index++) {
      const part = pathParts[index];
      const nodeId = pathParts.slice(0, index + 1).join('/');
      if (!tree.has(part)) {
        tree.set(part, new Set<string>()); // Initialize an empty Set if the node doesn't exist
      }
      
      const children = pathParts.slice(index + 1);
      children.forEach((child) => tree.get(part)!.add(child));
      
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
    }
  }

  const serializableTree: [string, string[]][] = Array.from(tree.entries()).map(
    ([key, value]) => [key, Array.from(value)]
  );

  return { nodes, edges, serializableTree};
}
