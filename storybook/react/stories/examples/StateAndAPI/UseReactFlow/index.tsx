import InteractionPanel from '@shared/InteractionPanel/InteractionPanel';
import { useCallback, MouseEvent } from 'react';
import {
  ReactFlow,
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
} from '@xyflow/react';

import { defaultFlowProps } from '@shared/defaultFlow';

const { nodes: initialNodes = [], edges: initialEdges = [], fitViewOptions } = defaultFlowProps;

const UseZoomPanHelperFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));
  const { screenToFlowPosition, setCenter, zoomIn, zoomOut, fitView } = useReactFlow();

  const onPaneClick = useCallback(
    (evt: MouseEvent) => {
      const projectedPosition = screenToFlowPosition({
        x: evt.clientX,
        y: evt.clientY,
      });

      setNodes((nds) =>
        nds.concat({
          id: crypto.randomUUID(),
          position: projectedPosition,
          data: {
            label: `${projectedPosition.x}-${projectedPosition.y}`,
          },
          type: 'default',
        })
      );
    },
    [screenToFlowPosition, setNodes]
  );

  const onNodeClick = useCallback(
    async (_: MouseEvent, node: Node) => {
      console.log('set center start');

      const { x, y } = node.position;
      await setCenter(x, y, { zoom: 1, duration: 1200 });

      console.log('set center success');
    },
    [setCenter]
  );

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
      maxZoom={Infinity}
    >
      <Panel position="top-left">
        <button
          onClick={async () => {
            await zoomIn({ duration: 1200 });
            console.log('zoomIn success');
          }}
        >
          zoomIn
        </button>
        <button onClick={() => zoomOut({ duration: 0 })}>zoomOut</button>
        <button
          onClick={async () => {
            console.log('fit view start');
            await fitView({ duration: 1200, padding: 0.3 });
            console.log('fit view success');
          }}
        >
          fitView default
        </button>
        <button
          onClick={async () => {
            console.log('fit view start');
            await fitView({ duration: 1200, padding: 0.3, ease: (t) => +t });
            console.log('fit view success');
          }}
        >
          fitView linear
        </button>
      </Panel>
      <InteractionPanel />
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
