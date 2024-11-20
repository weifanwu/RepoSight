"use client"
import Dagre from '@dagrejs/dagre';
import React, { useCallback } from 'react';
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

// Interface for the layout options (vertical or horizontal layout)
interface LayoutOptions {
  direction: 'TB' | 'LR'; // TB = Top to Bottom, LR = Left to Right
}

// Interface for props being passed into LayoutFlow component
interface NodesEdgesProps {
  initialNodes: Node[]; // Nodes to be passed to ReactFlow
  initialEdges: Edge[];  // Edges to be passed to ReactFlow
}

// Function to layout the graph elements
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
      // Adjust the node position to match React Flow's anchor point (top-left)
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

// The LayoutFlow component accepts initial nodes and edges as props
const LayoutFlow: React.FC<NodesEdgesProps> = ({ initialNodes, initialEdges }) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  // Handle layout changes (Vertical or Horizontal)
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

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log('Node clicked:', node); // Replace this with your desired behavior
    },
    [],
  );

  return (
    <ReactFlow
      style={{ width: '100%', height: '100vh' }}  // Use 100vh for full screen or specify another height
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
  );
};

// The App component needs to pass initialNodes and initialEdges to the LayoutFlow
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
