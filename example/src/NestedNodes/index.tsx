import { useState, MouseEvent, useCallback } from 'react';

import ReactFlow, {
  addEdge,
  Background,
  useNodesState,
  useEdgesState,
  MiniMap,
  Controls,
  Node,
  Edge,
  ReactFlowInstance,
  Connection,
} from 'react-flow-renderer';

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);
const onEdgeClick = (_: MouseEvent, edge: Edge) => console.log('click', edge);

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.8)', width: 200, height: 200 },
  },
  {
    id: '2a',
    data: { label: 'Node 2a' },
    position: { x: 10, y: 50 },
    parentNode: '2',
  },
  { id: '3', data: { label: 'Node 3' }, position: { x: 320, y: 100 }, className: 'light' },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 320, y: 200 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, 0.7)', width: 300, height: 300 },
  },
  {
    id: '4a',
    data: { label: 'Node 4a' },
    position: { x: 15, y: 65 },
    className: 'light',
    parentNode: '4',
    extent: 'parent',
  },
  {
    id: '4b',
    data: { label: 'Node 4b' },
    position: { x: 15, y: 120 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 255, 0.7)', height: 150, width: 270 },
    parentNode: '4',
  },
  {
    id: '4b1',
    data: { label: 'Node 4b1' },
    position: { x: 20, y: 40 },
    className: 'light',
    parentNode: '4b',
  },
  {
    id: '4b2',
    data: { label: 'Node 4b2' },
    position: { x: 100, y: 100 },
    className: 'light',
    parentNode: '4b',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2a-4a', source: '2a', target: '4a' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e3-4b', source: '3', target: '4b' },
  { id: 'e4a-4b1', source: '4a', target: '4b1' },
  { id: 'e4a-4b2', source: '4a', target: '4b2' },
  { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
];

const NestedFlow = () => {
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, []);
  const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => setRfInstance(reactFlowInstance), []);

  const updatePos = () => {
    setNodes((nds) => {
      return nds.map((n) => {
        n.position = {
          x: Math.random() * 400,
          y: Math.random() * 400,
        };

        return n;
      });
    });
  };

  const logToObject = () => console.log(rfInstance?.toObject());
  const resetTransform = () => rfInstance?.setViewport({ x: 0, y: 0, zoom: 1 });

  const toggleClassnames = () => {
    setNodes((nds) => {
      return nds.map((n) => {
        n.className = n.className === 'light' ? 'dark' : 'light';
        return n;
      });
    });
  };

  const toggleChildNodes = () => {
    setNodes((nds) => {
      return nds.map((n) => {
        n.hidden = !!n.parentNode && !n.hidden;
        return n;
      });
    });
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onInit={onInit}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      className="react-flow-basic-example"
      defaultZoom={1.5}
      minZoom={0.2}
      maxZoom={4}
      onlyRenderVisibleElements={false}
    >
      <MiniMap />
      <Controls />
      <Background />

      <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4 }}>
        <button onClick={resetTransform} style={{ marginRight: 5 }}>
          reset transform
        </button>
        <button onClick={updatePos} style={{ marginRight: 5 }}>
          change pos
        </button>
        <button onClick={toggleClassnames} style={{ marginRight: 5 }}>
          toggle classnames
        </button>
        <button style={{ marginRight: 5 }} onClick={toggleChildNodes}>
          toggleChildNodes
        </button>
        <button onClick={logToObject}>toObject</button>
      </div>
    </ReactFlow>
  );
};

export default NestedFlow;
