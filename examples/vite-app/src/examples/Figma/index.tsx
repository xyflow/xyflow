import ReactFlow, {
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  useReactFlow,
  useKeyPress,
} from 'reactflow';

const MULTI_SELECT_KEY = ['Meta', 'Shift'];

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

const defaultEdgeOptions = { zIndex: 0 };

const logEvent = (e: any) => console.log(e);

const BasicFlow = () => {
  const instance = useReactFlow();
  const spaceBarPressed = useKeyPress('Space');

  const updatePos = () => {
    instance.setNodes((nodes) =>
      nodes.map((node) => {
        node.position = {
          x: Math.random() * 400,
          y: Math.random() * 400,
        };

        return node;
      })
    );
  };

  const logToObject = () => console.log(instance.toObject());
  const resetTransform = () => instance.setViewport({ x: 0, y: 0, zoom: 1 });

  const toggleClassnames = () => {
    instance.setNodes((nodes) =>
      nodes.map((node) => {
        node.className = node.className === 'light' ? 'dark' : 'light';

        return node;
      })
    );
  };

  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      selectBoxOnDrag
      selectBoxMode="Overlap"
      panOnDrag={spaceBarPressed ? true : 'RightClick'}
      panOnScroll
      onPaneContextMenu={logEvent}
      zoomActivationKeyCode={'Meta'}
      multiSelectionKeyCode={MULTI_SELECT_KEY}
      className="react-flow-basic-example"
      minZoom={0.2}
      maxZoom={4}
      fitView
      defaultEdgeOptions={defaultEdgeOptions}
      selectNodesOnDrag={false}
    >
      <Background variant={BackgroundVariant.Lines} />

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
        <button onClick={logToObject}>toObject</button>
      </div>
    </ReactFlow>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <BasicFlow />
    </ReactFlowProvider>
  );
}
