"use client";
import { useTree } from "@/context/treeContext";
import FolderUpload from "@/components/uploader/fileUploader";
import Diagram from "@/components/flow_diagram/diagram";
// import ApiKeyPopup from "@/components/openai/apiKeyPopup";
import { Node, Edge } from "@xyflow/react";
import React, { useState } from "react";

const Page: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  // const { apiKey } = useTree();

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
          <h2>Upload and Visualize your GitHub folder!</h2>
          <FolderUpload onUploadComplete={handleUploadComplete} />
          {nodes.length > 0 && edges.length > 0 && <Diagram initialNodes={nodes} initialEdges={edges} />}
        </>
      {/* )} */}
    </div>
  );
};

export default Page;
