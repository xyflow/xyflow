import { useState, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Controls,
  NodeChange,
  EdgeChange,
  Node,
  Connection,
  Edge,
  CoordinateExtent,
  Position,
} from 'react-flow-renderer';
import dagre from 'dagre';

import initialNodesAndEdges from './initial-elements';

import './layouting.css';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeExtent: CoordinateExtent = [
  [0, 0],
  [1000, 1000],
];

const LayoutFlow = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodesAndEdges.nodes);
  const [edges, setEdges] = useState<Edge[]>(initialNodesAndEdges.edges);

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => {
      return addEdge(params, eds);
    });
  }, []);

  const onLayout = (direction: string) => {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 150, height: 50 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
      // we need to pass a slightly different position in order to notify react flow about the change
      // @TODO how can we change the position handling so that we dont need this hack?
      node.position = { x: nodeWithPosition.x + Math.random() / 1000, y: nodeWithPosition.y };

      return node;
    });

    setNodes(layoutedNodes);
  };

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((ns) => applyNodeChanges(changes, ns)), []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es));
  }, []);

  return (
    <div className="layoutflow">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          nodeExtent={nodeExtent}
          onLoad={() => onLayout('TB')}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        >
          <Controls />
        </ReactFlow>
        <div className="controls">
          <button onClick={() => onLayout('TB')} style={{ marginRight: 10 }}>
            vertical layout
          </button>
          <button onClick={() => onLayout('LR')}>horizontal layout</button>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default LayoutFlow;
