"use client"
import { useState, ChangeEvent } from "react";

interface UploadedFile extends File {
  webkitRelativePath: string;
}

export default function FolderUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleFolderUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []) as UploadedFile[];
    setFiles(selectedFiles);
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
      
      <div>
        <h3>Uploaded Files:</h3>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              {file.webkitRelativePath} - {file.size} bytes
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
