"use client";
import { useState, ChangeEvent } from "react";
import { Node, Edge } from "@xyflow/react";
import FolderInput from "./folderInput";
import { useTree } from "@/context/treeContext";

interface UploadedFile extends File {
  webkitRelativePath: string;
}

interface FolderUploadProps {
  onUploadComplete: (hierarchy: HierarchyNode) => void;
}

export default function FolderUpload({ onUploadComplete }: FolderUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const { setTree, setText } = useTree();

  const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []) as UploadedFile[];
  
    const readmeFiles: UploadedFile[] = [];
    const filteredFiles = selectedFiles.filter((file) => {
      const isInNodeModules = file.webkitRelativePath.includes("node_modules");
      const isReadme = file.name.toLowerCase() === "readme.md";
      const isInRoot = file.webkitRelativePath.split("/").length === 2; // Only root folder files have no subdirectories
  
      if (isReadme && isInRoot && !isInNodeModules) {
        readmeFiles.push(file);
      }
      return !isInNodeModules && (!isReadme || !isInRoot);
    });
  
    const readFileContent = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file content"));
        reader.readAsText(file);
      });
  
    try {
      const fileContents = await Promise.all(
        readmeFiles.map((file) => readFileContent(file as File))
      );
      setText(fileContents.join());
  
      await handleFileSubmit(filteredFiles);
    } catch (error) {
      console.error("Error reading README files:", error);
      setUploadStatus("Error processing folder.");
    }
  };  

  const handleFileSubmit = async (files: UploadedFile[]) => {
    setUploadStatus("Submitting files...");
    const filePaths = files.map((file) => file.webkitRelativePath);

    try {
      const response = await fetch("/api/diagram", {
        method: "POST",
        body: JSON.stringify({ filePaths }),
      });

      if (response.ok) {
        const data = await response.json();
        const serializableTree = data.nodesAndEdges.serializableTree;
        const tree: Tree = new Map();
        for (const [key, value] of serializableTree) {
          tree.set(key, new Set(value));
        }
        setTree(tree);
        onUploadComplete(data.nodesAndEdges.hierarchy);
        setUploadStatus("Files uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload files.");
      }
    } catch (error) {
      setUploadStatus("An error occurred while uploading.");
      console.error(error);
    }
  };

  return (
    <FolderInput
      handleFolderUpload={handleFolderUpload}
      FolderInputStatus={uploadStatus}
    />
  );
}
