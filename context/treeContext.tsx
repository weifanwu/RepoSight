"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the tree structure type

// Context value type
interface FileTreeContextValue {
  tree: Tree;
  text: String;
  setTree: (newTree: Tree) => void;
  setText: (newText: String) => void;
}

// Create the TreeContext
const FileTreeContext = createContext<FileTreeContextValue | undefined>(undefined);

// Provide the TreeContext to the app
export const TreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tree, setTreeState] = useState<Tree>(new Map());
    const [text, setTextState] = useState<String>("");

  const setTree = (newTree: Tree) => {
    setTreeState(newTree);
  };

  const setText = (newText: String) => {
    setTextState(newText);
  };

  return (
    <FileTreeContext.Provider value={{ text, tree, setTree, setText }}>
      {children}
    </FileTreeContext.Provider>
  );
};

// Custom hook to use the TreeContext
export const useTree = () => {
  const context = useContext(FileTreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};
