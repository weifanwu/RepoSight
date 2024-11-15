"use client"
import { useState, ChangeEvent } from "react";

interface UploadedFile extends File {
  webkitRelativePath: string;
}

interface FolderUploadProps {
  onUploadComplete: (nodes: any[], edges: any[]) => void; // Adjust this type as per your data
}

export default function FolderUpload({ onUploadComplete }: FolderUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFolderUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []) as UploadedFile[];
    setFiles(selectedFiles);
  };

  const handleFileSubmit = async () => {
    const formData = new FormData();

    // Append each file to the FormData
    files.forEach((file) => {
      formData.append("files", file, file.webkitRelativePath);
    });

    try {
      const response = await fetch("/api/json", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
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
      <button onClick={handleFileSubmit}>Upload Files</button>
      <div>
        <h3>Uploaded Files:</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              {file.webkitRelativePath} - {file.size} bytes
            </li>
          ))}
        </ul>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>
    </div>
  );
}
