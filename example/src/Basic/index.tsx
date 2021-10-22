import { useState, useMemo, MouseEvent, useCallback } from 'react';

import ReactFlow, {
  addEdge,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MiniMap,
  Controls,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  OnLoadParams,
  Connection,
} from 'react-flow-renderer';

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('drag stop', node);
const onNodeClick = (_: MouseEvent, node: Node) => console.log('click', node);
const onEdgeClick = (_: MouseEvent, edge: Edge) => console.log('click', edge);

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 250, y: 5 }, className: 'light' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 100, y: 100 }, className: 'light' },
  { id: '3', data: { label: 'Node 3' }, position: { x: 400, y: 100 }, className: 'light' },
  {
    id: '4',
    data: { label: 'Node 4' },
    position: { x: 0, y: 0 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, .2)' },
    width: 0,
    height: 0,
  },
  {
    id: '4a',
    data: { label: 'Node 4a' },
    position: { x: 70, y: 200 },
    className: 'light',
    parentNode: '4',
  },
  {
    id: '4b',
    data: { label: 'Node 4b' },
    position: { x: 0, y: 0 },
    className: 'light',
    style: { backgroundColor: 'rgba(255, 0, 0, .2)' },
    parentNode: '4',
  },
  {
    id: '4b1',
    data: { label: 'Node 4b1' },
    position: { x: 150, y: 270 },
    className: 'light',
    parentNode: '4b',
  },
  {
    id: '4b2',
    data: { label: 'Node 4b2' },
    position: { x: 420, y: 370 },
    className: 'light',
    parentNode: '4b',
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4a', source: '2', target: '4a', animated: true },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e3-4b', source: '3', target: '4b' },
  { id: 'e3-4b2', source: '3', target: '4b2' },
  { id: 'e4a-4b1', source: '4a', target: '4b1' },
  { id: 'e4a-4b2', source: '4a', target: '4b2' },
  { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
];

const BasicFlow = () => {
  const [rfInstance, setRfInstance] = useState<OnLoadParams | null>(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => {
      return addEdge(params, eds);
    });
  }, []);
  const onLoad = useCallback((reactFlowInstance: OnLoadParams) => setRfInstance(reactFlowInstance), []);

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
  const resetTransform = () => rfInstance?.setTransform({ x: 0, y: 0, zoom: 1 });

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
        n.isHidden = !!n.parentNode && !n.isHidden;
        return n;
      });
    });
  };

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es));
  }, []);

  const nodesWithLabel = useMemo(
    () =>
      nodes.map((n) => {
        n.data = { ...n.data, label: `${n.width}x${n.height}` };
        return n;
      }),
    [nodes]
  );

  return (
    <ReactFlow
      nodes={nodesWithLabel}
      edges={edges}
      onLoad={onLoad}
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

export default BasicFlow;
