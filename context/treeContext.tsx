"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileTreeContextValue {
  fileTree: FileTree;
  readme: String;
  apiKey: String;
  setFileTree: (newFileTree: FileTree) => void;
  setReadme: (newReadMe: String) => void;
  setApiKey: (newKey: String) => void;
}

const FileTreeContext = createContext<FileTreeContextValue | undefined>(undefined);

export const FileTreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [fileTree, setFileTreeState] = useState<FileTree>(new Map());
    const [readme, setTextState] = useState<String>("");
    const [apiKey, setApiKey] = useState<String>("");

  const setFileTree = (newTree: FileTree) => {
    setFileTreeState(newTree);
  };

  const setReadme = (newText: String) => {
    setTextState(newText);
  };

  return (
    <FileTreeContext.Provider value={{ apiKey, readme, fileTree, setFileTree, setReadme, setApiKey }}>
      {children}
    </FileTreeContext.Provider>
  );
};

export const useFileTree = () => {
  const context = useContext(FileTreeContext);
  if (!context) {
    throw new Error('useTree must be used within a TreeProvider');
  }
  return context;
};