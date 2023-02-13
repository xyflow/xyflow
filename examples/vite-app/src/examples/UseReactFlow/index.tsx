import { useCallback, MouseEvent, useEffect } from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  Node,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    className: 'light',
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    className: 'light',
  },
  {
    id: '3',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    className: 'light',
  },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    className: 'light',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  // { id: 'e3-4', source: '3', target: '4' }
];

let id = 5;

const getId = () => `${id++}`;

const UseZoomPanHelperFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));
  const {
    project,
    setCenter,
    zoomIn,
    zoomOut,
    fitView,
    addNodes,
    setNodes: setNodesHook,
    addEdges,
    getNodes,
    getEdges,
    deleteElements,
  } = useReactFlow();

  const onPaneClick = useCallback(
    (evt: MouseEvent) => {
      const projectedPosition = project({
        x: evt.clientX,
        y: evt.clientY - 40,
      });

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
    (_: MouseEvent, node: Node) => {
      const { x, y } = node.position;
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

  const logNodes = useCallback(() => {
    console.log('nodes', getNodes());
    console.log('edges', getEdges());
  }, [getNodes, getEdges]);

  const deleteSelectedElements = useCallback(() => {
    const selectedNodes = nodes.filter((node) => node.selected);
    const selectedEdges = edges.filter((edge) => edge.selected);
    deleteElements({ nodes: selectedNodes, edges: selectedEdges });
  }, [deleteElements, nodes, edges]);

  const deleteSomeElements = useCallback(() => {
    deleteElements({ nodes: [{ id: '2' }], edges: [{ id: 'e1-3' }] });
  }, []);

  useEffect(() => {
    addEdges({ id: 'e3-4', source: '3', target: '4' });
  }, [addEdges]);

  const onResetNodes = useCallback(() => setNodesHook(initialNodes), [setNodesHook]);

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
      <Panel position="top-right">
        <button onClick={() => zoomIn({ duration: 1200 })}>zoomIn</button>
        <button onClick={() => zoomOut({ duration: 0 })}>zoomOut</button>
        <button onClick={() => fitView({ duration: 1200, padding: 0.3 })}>fitView</button>
        <button onClick={onAddNode}>add node</button>
        <button onClick={onResetNodes}>reset nodes</button>
        <button onClick={logNodes}>useNodes</button>
        <button onClick={deleteSelectedElements}>deleteSelectedElements</button>
        <button onClick={deleteSomeElements}>deleteSomeElements</button>
      </Panel>
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
