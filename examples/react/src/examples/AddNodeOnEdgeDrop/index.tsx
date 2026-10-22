import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  OnConnect,
  OnConnectStart,
  OnConnectEnd,
  Node,
  Edge,
} from '@xyflow/react';

const initialNodes: Node[] = [
  {
    id: '0',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
  },
];

const initialEdges: Edge[] = [];

let id = 1;
const getId = () => `${id++}`;

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition, getInternalNode } = useReactFlow();
  const onConnect: OnConnect = useCallback((params) => {
    // reset the start node on connections
    connectingNodeId.current = null;
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = (event.target as Partial<Element> | null)?.classList?.contains('react-flow__pane');

      if (targetIsPane && 'clientX' in event && 'clientY' in event) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const newNode: Node = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        };

        const newEdge: Edge = {
          id,
          source: connectingNodeId.current,
          target: id,
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));
      }
    },
    [screenToFlowPosition]
  );

  /*
   * Fired when a connection started with a click or the keyboard ends on the pane.
   * Keyboard events carry no pointer position, so the new node is placed below the
   * node the connection was started from.
   */
  const onClickConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      if (!connectingNodeId.current) return;

      const targetIsPane = (event.target as Partial<Element> | null)?.classList?.contains('react-flow__pane');

      if (targetIsPane) {
        const sourceNode = getInternalNode(connectingNodeId.current);
        const id = getId();
        const newNode: Node = {
          id,
          position: {
            x: sourceNode?.internals.positionAbsolute.x ?? 0,
            y: (sourceNode?.internals.positionAbsolute.y ?? 0) + (sourceNode?.measured.height ?? 0) + 50,
          },
          data: { label: `Node ${id}` },
        };

        const newEdge: Edge = {
          id,
          source: connectingNodeId.current,
          target: id,
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat(newEdge));
        connectingNodeId.current = null;
      }
    },
    [getInternalNode]
  );

  return (
    <div className="wrapper" ref={reactFlowWrapper} style={{ height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onClickConnectStart={onConnectStart}
        onClickConnectEnd={onClickConnectEnd}
        fitView
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);
