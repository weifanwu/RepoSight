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
  const handleFolderUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []) as UploadedFile[];

    const readmeFiles: UploadedFile[] = [];
    const filteredFiles = selectedFiles.filter((file) => {
      const isReadme = file.name.toLowerCase() === "readme.md"; // Case-insensitive check for README.md
      if (isReadme) {
        readmeFiles.push(file);
      }
      return (
        !file.webkitRelativePath.includes("node_modules") && !isReadme // Exclude node_modules and README files
      );
    });

    const readFileContent = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file content"));
        reader.readAsText(file);
      });

    try {
      // Read README files asynchronously
      const fileContents = await Promise.all(
        readmeFiles.map((file) => readFileContent(file as File))
      );

      setFiles(filteredFiles);
      setUploadStatus("Folder processed successfully!");
    } catch (error) {
      console.error("Error reading README files:", error);
      setUploadStatus("Error processing folder.");
    }
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
