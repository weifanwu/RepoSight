import React from "react";

declare global {
  type FileTree = Map<string, Set<string>>;
  type HierarchyNode = {
    name: string;
    children?: HierarchyNode[];
  };
}

declare module "react" {
  interface InputHTMLAttributes<T> extends React.DOMAttributes<T> {
    webkitdirectory?: string;
  }
}

export {};