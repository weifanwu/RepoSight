"use client";
import Dagre from '@dagrejs/dagre';
import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './index.css';
import { useTree } from '@/context/treeContext';

interface LayoutOptions {
  direction: 'TB' | 'LR';
}

interface NodesEdgesProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

const getLayoutedElements = (nodes: Node[], edges: Edge[], options: LayoutOptions) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow: React.FC<NodesEdgesProps> = ({ initialNodes, initialEdges }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const { text, tree } = useTree();

  const [popupContent, setPopupContent] = useState<string | null>(null); // Popup content
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null); // Popup position

  const onLayout = useCallback(
    (direction: 'TB' | 'LR') => {
      const layouted = getLayoutedElements(nodes, edges, { direction });

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges, setNodes, setEdges, fitView],
  );

  const onNodeClick = (event: React.MouseEvent, node: Node) => {
    event.preventDefault(); // Prevent default behavior

    const fileNames = node.id.split('/');
    const fileName = fileNames[fileNames.length - 1];
    const children = [...(tree.get(fileName) || [])].join(' ');
    const prompt = JSON.stringify({
      prompt: `Use the information below to infer the functionality of this folder called:  "${fileName}" in one paragraph, limited to 100 words, make sure your answer connects to the overall project and include the folder name. Readme file: ${text}, children files and folder names: ${children}`,
    });

    fetch('/api/ai/reader', {
      method: 'POST',
      body: prompt,
    })
      .then((response) => {
        if (!response.ok) {
          console.error('Failed to fetch data from /api/ai/reader');
          return;
        }
        return response.json();
      })
      .then((data) => {
        const message = data.message;

        // Set popup content and position
        setPopupContent(message);
        setPopupPosition({ x: event.clientX, y: event.clientY });
      })
      .catch((error) => {
        console.error('Error in onNodeClick:', error);
      });
  };

  const closePopup = () => {
    setPopupContent(null);
    setPopupPosition(null);
  };

  return (
    <>
      <ReactFlow
        style={{ width: '100%', height: '100vh' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
      >
        <Panel position="top-right">
          <button onClick={() => onLayout('TB')}>Vertical Layout</button>
          <button onClick={() => onLayout('LR')}>Horizontal Layout</button>
        </Panel>
      </ReactFlow>

      {popupContent && popupPosition && (
        <div
          style={{
            position: 'absolute',
            top: popupPosition.y,
            left: popupPosition.x,
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            zIndex: 1000,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            maxWidth: '300px', // Sets a maximum width
            minWidth: '200px', // Ensures the popup isn't too narrow
            width: 'auto',      // Allows the width to adjust based on content
            wordWrap: 'break-word', // Prevents long words from overflowing
          }}
        >
          <p>{popupContent}</p>
          <button
            onClick={closePopup}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

interface AppProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

const App: React.FC<AppProps> = ({ initialNodes, initialEdges }) => {
  return (
    <div style={{ height: 800 }}>
      <ReactFlowProvider>
        <LayoutFlow initialNodes={initialNodes} initialEdges={initialEdges} />
      </ReactFlowProvider>
    </div>
  );
};

export default App;
