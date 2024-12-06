"use client";
// import { useTree } from "@/context/treeContext";
import FolderUpload from "@/components/uploader/fileUploader";
import CollapsibleTree from "@/components/flow_diagram/d3CollapsibleTree";
// import ApiKeyPopup from "@/components/openai/apiKeyPopup";
import React, { useState } from "react";
import Navbar from "@/components/navbar/navbar";

const Page: React.FC = () => {
  const [hierarchy, setHierarchy] = useState<HierarchyNode>();
  // const { apiKey } = useTree();

  const handleSearch = () => {
    console.log("searching...");
  };

  // Generate JSON file for download
  const handleDownload = () => {
    console.log("downloading...");
  };

  const handleUploadComplete = (hierarchy: HierarchyNode) => {
    setHierarchy(hierarchy);
  };


  // todo: add api key popup so the user can input their api key
  return (
    <div>
      {/* {!apiKey && <ApiKeyPopup />}
      {apiKey && ( */}
        <>
        <Navbar onSearch={handleSearch} onDownload={handleDownload} />
        <FolderUpload onUploadComplete={handleUploadComplete} />
        <CollapsibleTree hierarchy={hierarchy} />
        </>
      {/* )} */}
    </div>
  );
};

export default Page;
