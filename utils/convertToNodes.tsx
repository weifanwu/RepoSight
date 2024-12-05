export function convertFilesToHierarchyWithTree(
  files: string[]
): { hierarchy: HierarchyNode; serializableTree: [string, string[]][] } {
  const tree: Map<string, Set<string>> = new Map();

  // Helper function to build the tree structure
  const buildHierarchy = (paths: string[]): { [key: string]: any } => {
    const root: any = {};

    for (const path of paths) {
      const parts = path.split('/');
      if (parts.some((part) => part.startsWith('.') || part === 'node_modules')) {
        continue; // Ignore hidden files and node_modules
      }
      let currentLevel = root;
      let parent = '';
      for (const part of parts) {
        const currentPath = parent ? `${parent}/${part}` : part;
        parent = currentPath;

        if (!tree.has(parent)) {
          tree.set(parent, new Set());
        }

        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      }

      // Update the tree structure
      parts.forEach((_, i) => {
        const parentPath = parts.slice(0, i).join('/');
        const child = parts[i];
        if (parentPath && child) {
          if (!tree.has(parentPath)) {
            tree.set(parentPath, new Set());
          }
          tree.get(parentPath)!.add(child);
        }
      });
    }

    return root;
  };

  // Recursive function to convert the tree structure into D3-compatible format
  const transformToD3Format = (node: any, name: string): any => {
    const children = Object.entries(node).map(([key, value]) => transformToD3Format(value, key));
    return children.length > 0 ? { name, children } : { name };
  };

  // Build the tree structure
  const hierarchyTree = buildHierarchy(files);

  // Convert to D3-compatible hierarchy
  const hierarchy = transformToD3Format(hierarchyTree, 'root');

  // Convert the `tree` map to serializable format
  const serializableTree: [string, string[]][] = Array.from(tree.entries()).map(
    ([key, value]) => [key, Array.from(value)]
  );

  return { hierarchy, serializableTree };
}