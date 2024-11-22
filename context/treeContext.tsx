"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileTreeContextValue {
  tree: Tree;
  text: String;
  apiKey: String;
  setTree: (newTree: Tree) => void;
  setText: (newText: String) => void;
  setApiKey: (newKey: String) => void;
}

const FileTreeContext = createContext<FileTreeContextValue | undefined>(undefined);

export const FileTreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tree, setTreeState] = useState<Tree>(new Map());
    const [text, setTextState] = useState<String>("");
    const [apiKey, setApiKey] = useState<String>("");

  const setTree = (newTree: Tree) => {
    setTreeState(newTree);
  };

  const setText = (newText: String) => {
    setTextState(newText);
  };

  return (
    <FileTreeContext.Provider value={{ apiKey, text, tree, setTree, setText, setApiKey }}>
      {children}
    </FileTreeContext.Provider>
  );
};

export const useTree = () => {
  const context = useContext(FileTreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};