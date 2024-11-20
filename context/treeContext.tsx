"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the tree structure type

// Context value type
interface TreeContextValue {
  tree: Tree;
  setTree: (newTree: Tree) => void;
}

// Create the TreeContext
const TreeContext = createContext<TreeContextValue | undefined>(undefined);

// Provide the TreeContext to the app
export const TreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tree, setTreeState] = useState<Tree>(new Map());

  const setTree = (newTree: Tree) => {
    setTreeState(newTree);
  };

  return (
    <TreeContext.Provider value={{ tree, setTree }}>
      {children}
    </TreeContext.Provider>
  );
};

// Custom hook to use the TreeContext
export const useTree = () => {
  const context = useContext(TreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};
