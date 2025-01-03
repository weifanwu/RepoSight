import React from "react";

interface FolderInputProps {
  handleFolderUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  FolderInputStatus?: string;
}

// React component for folder input handling
const FolderInput: React.FC<FolderInputProps> = ({
  handleFolderUpload,
  FolderInputStatus,
}) => {
  return (
    <div className="fixed flex flex-col items-center justify-center bg-gray mt-20 ml-4 z-50">
      <label
        htmlFor="folder-upload"
        className="flex flex-col items-center w-50 px-4 py-6 text-blue bg-white border border-blue rounded-lg shadow-lg cursor-pointer hover:bg-blue hover:text-white tracking-wide uppercase"
      >
        <svg
          className="w-8 h-8"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
        </svg>
        <span className="mt-2 text-base leading-normal">Select a folder</span>
        <input
          id="folder-upload"
          type="file"
          className="hidden"
          webkitdirectory="true"
          multiple
          onChange={handleFolderUpload} // Single handler for folder upload
        />
      </label>

      {FolderInputStatus && (
        <div className="mt-4 text-center">
          <p className="text-gray-700">{FolderInputStatus}</p>
        </div>
      )}
    </div>
  );
};

export default FolderInput;
