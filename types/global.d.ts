import React from "react";

declare module "react" {
  interface InputHTMLAttributes<T> extends React.DOMAttributes<T> {
    webkitdirectory?: string;
  }
}