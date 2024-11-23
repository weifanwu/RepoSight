"use client";
// import { useTree } from "@/context/treeContext";
import FolderUpload from "@/components/uploader/fileUploader";
import Diagram from "@/components/flow_diagram/diagram";
// import ApiKeyPopup from "@/components/openai/apiKeyPopup";
import { Node, Edge } from "@xyflow/react";
import React, { useState } from "react";
import Navbar from "@/components/navbar/navbar";

const Page: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [_, setFilteredNodes] = useState<Node[]>([]);
  // const { apiKey } = useTree();

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredNodes(nodes); // Reset to all nodes if query is empty
    } else {

      setFilteredNodes([]);
    }
  };

  // Generate JSON file for download
  const handleDownload = () => {
    console.log("downloading...");
  };

  const handleUploadComplete = (uploadedNodes: Node[], uploadedEdges: Edge[]) => {
    setNodes(uploadedNodes);
    setEdges(uploadedEdges);
  };


  // todo: add api key popup so the user can input their api key
  return (
    <div>
      {/* {!apiKey && <ApiKeyPopup />}
      {apiKey && ( */}
        <>
        <Navbar onSearch={handleSearch} onDownload={handleDownload} />
        <FolderUpload onUploadComplete={handleUploadComplete} />
          {nodes.length > 0 && edges.length > 0 && <Diagram initialNodes={nodes} initialEdges={edges} />}
        </>
      {/* )} */}
    </div>
  );
};

export default Page;
