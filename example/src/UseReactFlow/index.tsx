import { useCallback } from 'react';

import ReactFlow, {
  Node,
  addEdge,
  Background,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  { id: '4', data: { label: 'Node 4' }, position: { x: 400, y: 200 }, className: 'light' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
];

let id = 5;

const getId = () => `${id++}`;

const UseZoomPanHelperFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));
  const { project, setCenter, zoomIn, zoomOut, fitView, addNodes, setNodes: setNodesHook } = useReactFlow();

  const onPaneClick = useCallback(
    (evt) => {
      const projectedPosition = project({ x: evt.clientX, y: evt.clientY - 40 });

      setNodes((nds) =>
        nds.concat({
          id: getId(),
          position: projectedPosition,
          data: {
            label: `${projectedPosition.x}-${projectedPosition.y}`,
          },
        })
      );
    },
    [project, setNodes]
  );

  const onNodeClick = useCallback(
    (_, element) => {
      const { x, y } = element.position;
      setCenter(x, y, { zoom: 1, duration: 1200 });
    },
    [setCenter]
  );

  const onAddNode = useCallback(() => {
    const newNode = {
      id: getId(),
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      data: {
        label: 'New Node',
      },
    };

    addNodes(newNode);
  }, [addNodes]);

  const onResetNodes = useCallback(() => {
    setNodesHook(initialNodes);
  }, [setNodesHook]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      fitView
      fitViewOptions={{ duration: 1200, padding: 0.2 }}
      maxZoom={Infinity}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 100 }}>
        <button onClick={() => zoomIn({ duration: 1200 })}>zoomIn</button>
        <button onClick={() => zoomOut({ duration: 0 })}>zoomOut</button>
        <button onClick={() => fitView({ duration: 1200, padding: 0.3 })}>fitView</button>
        <button onClick={onAddNode}>add node</button>
        <button onClick={onResetNodes}>reset nodes</button>
      </div>
      <Background />
      <MiniMap />
    </ReactFlow>
  );
};

const WrappedFlow = () => (
  <ReactFlowProvider>
    <UseZoomPanHelperFlow />
  </ReactFlowProvider>
);

export default WrappedFlow;
