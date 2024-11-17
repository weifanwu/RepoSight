"use client"
import { useState } from 'react';
import FolderUpload from "@/components/uploader/fileUploader";
import Diagram from "@/components/flow_diagram/diagram";
import { Node, Edge } from '@xyflow/react';

const Page: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // This function is called when the upload is complete
  const handleUploadComplete = (uploadedNodes: Node[], uploadedEdges: Edge[]) => {
    setNodes(uploadedNodes);
    setEdges(uploadedEdges);
  };

  return (
    <div>
      {/* Pass the upload handler to the FolderUpload component */}
      <h2>Upload and Visualize your github folder!</h2>
      <FolderUpload onUploadComplete={handleUploadComplete} />

      {nodes.length > 0 && edges.length > 0 && (
        <Diagram initialNodes={nodes} initialEdges={edges} />
      )}
    </div>
  );
};

export default Page;
