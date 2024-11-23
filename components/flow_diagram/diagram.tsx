"use client";
import Dagre from '@dagrejs/dagre';
import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
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
  const [loading, setLoading] = useState<boolean>(false);
  const { text, tree } = useTree();

  const [popupContent, setPopupContent] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

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
    setLoading(true);
    setPopupPosition({ x: event.clientX, y: event.clientY });
    event.preventDefault();

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

        setLoading(false);
        setPopupContent(message);
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
        defaultViewport={{x: 0, y: 0, zoom: 1}}
        fitView
      >
        <MiniMap
          style={{
            border: '2px solid #6ede87', // Add a visible border
          }}
          zoomable
          pannable
          nodeColor="#6ede87"
          nodeBorderRadius={5} // Make node shapes more distinct
          nodeStrokeWidth={2} // Add bold outlines to nodes
        />
        <Background
          id="1"
          gap={50}
          color="#f1f1f1"
          variant={BackgroundVariant.Lines}
        />

        <Panel 
          position='top-right'
          style={{ marginTop: '100px' }}
          >
        <div className="flex flex-col items-center">
          <button 
            onClick={() => onLayout('TB')} 
            className="bg-blue-300 hover:bg-blue-400 text-gray-700 font-bold py-2 px-10 rounded w-40"
          >
            Vertical
          </button>
          <button 
            onClick={() => onLayout('LR')} 
            className="bg-green-300 hover:bg-green-400 text-gray-700 font-bold py-2 px-10 rounded w-40"
          >
            Horizontal
          </button>
        </div>
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
            maxWidth: '300px',
            minWidth: '200px',
            width: 'auto',
            wordWrap: 'break-word',
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
      {loading && popupPosition && (
        <div
          style={{
            position: 'absolute',
            top: popupPosition.y,
            left: popupPosition.x,
            transform: 'translate(-50%, -50%)', // Center the loader at the click point
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '10px',
            zIndex: 1000,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div>
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