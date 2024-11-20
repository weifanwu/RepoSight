"use client";
import { useState, ChangeEvent } from "react";
import { Node, Edge } from "@xyflow/react";
import { useTree } from "@/context/treeContext";

interface UploadedFile extends File {
  webkitRelativePath: string;
}

interface FolderUploadProps {
  onUploadComplete: (nodes: Node[], edges: Edge[]) => void;
}

export default function FolderUpload({ onUploadComplete }: FolderUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const {setTree} = useTree();
  const handleFolderUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []) as UploadedFile[];

    // Exclude files from the "node_modules" directory
    const filteredFiles = selectedFiles.filter(
      (file) => !file.webkitRelativePath.includes("node_modules")
    );

    setFiles(filteredFiles);
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();

    // Append each file to the FormData
    files.forEach((file) => {
      formData.append("files", file, file.webkitRelativePath);
    });

    try {
      const response = await fetch("/api/diagram", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const serializableTree = data.nodesAndEdges.serializableTree;
        const tree: Tree = new Map();
        for (const [key, value] of serializableTree) {
          tree.set(key, new Set(value));
        }
        setTree(tree);
        onUploadComplete(data.nodesAndEdges["nodes"], data.nodesAndEdges["edges"]);
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
    <div>
      <input
        type="file"
        webkitdirectory="true"
        multiple
        onChange={handleFolderUpload}
        style={{ marginBottom: "10px" }}
      />
      <button onClick={handleFileSubmit}>Create Diagram</button>
      <div>
        {uploadStatus && (
          <div>
            <p>{uploadStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
}
