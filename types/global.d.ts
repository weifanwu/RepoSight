import React from "react";

declare global {
  type Tree = Map<string, Set<string>>;
}

declare module "react" {
  interface InputHTMLAttributes<T> extends React.DOMAttributes<T> {
    webkitdirectory?: string;
  }
}

export {};