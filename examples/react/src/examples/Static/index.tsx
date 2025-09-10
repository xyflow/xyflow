import { CSSProperties } from 'react';
import { ReactFlowStatic, Node, Edge, Position, Background, Handle } from '@xyflow/react';

const nodesA: Node[] = [
  {
    id: '1a',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
    width: 100,
    height: 40,
    handles: [{ type: 'source', position: Position.Bottom, x: 50, y: 40 }],
  },
  {
    id: '2a',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    width: 100,
    height: 40,
    handles: [
      { type: 'source', position: Position.Bottom, x: 50, y: 40 },
      { type: 'target', position: Position.Top, x: 50, y: 0 },
    ],
  },
  {
    id: '3a',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    width: 100,
    height: 40,
    handles: [
      { type: 'source', position: Position.Bottom, x: 50, y: 40 },
      { type: 'target', position: Position.Top, x: 50, y: 0 },
    ],
  },
  {
    id: '4a',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    width: 100,
    height: 40,
    handles: [
      { type: 'source', position: Position.Bottom, x: 50, y: 40 },
      { type: 'target', position: Position.Top, x: 50, y: 0 },
    ],
  },
];
const edgesA: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

const nodesB: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 0, y: 0 },
    width: 100,
    height: 40,
    handles: [{ type: 'source', position: Position.Bottom, x: 50, y: 40 }],
  },
  {
    id: '2',
    data: { label: 'Node 2' },
    position: { x: 500, y: 500 },
    className: 'light',
    ariaLabel: 'Default Node 2',
    width: 100,
    height: 40,
    handles: [
      { type: 'source', position: Position.Bottom, x: 50, y: 40 },
      { type: 'target', position: Position.Top, x: 50, y: 0 },
    ],
  },
  {
    id: '3',
    type: 'custom',
    data: { label: 'Node 3' },
    position: { x: 800, y: 100 },
    width: 100,
    height: 100,
    handles: [{ type: 'target', position: Position.Left, x: 0, y: 50 }],
  },
];

const edgesB: Edge[] = [{ id: 'e1-3', source: '1', target: '3' }];

const nodesC: Node[] = [
  {
    id: '1a',
    type: 'input',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },

    width: 100,
    height: 40,
  },
  {
    id: '2a',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
    width: 100,
    height: 40,
  },
  {
    id: '3a',
    data: { label: 'Node 3' },
    position: { x: 400, y: 100 },
    width: 100,
    height: 40,
  },
  {
    id: '4a',
    data: { label: 'Node 4' },
    position: { x: 400, y: 200 },
    width: 100,
    height: 40,
  },
];

const edgesC: Edge[] = [
  { id: 'e1-2', source: '1a', target: '2a' },
  { id: 'e1-3', source: '1a', target: '3a' },
];

const nodesD: Node[] = [
  {
    id: '1a',
    data: { label: 'Node 1' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2a',
    data: { label: 'Node 2' },
    position: { x: 100, y: 100 },
  },
];

const edgesD: Edge[] = [{ id: 'e1-2', source: '1a', target: '2a' }];

const nodeTypes = {
  custom: () => (
    <div
      style={{
        borderRadius: 100,
        border: '1px solid #222',
        background: '#fff',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      Custom
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
    </div>
  ),
};

const BasicFlow = ({
  nodes,
  edges,
  style,
  id,
}: {
  nodes: Node[];
  edges: Edge[];
  style?: CSSProperties;
  id?: string;
}) => {
  return (
    <>
      <ReactFlowStatic id={id} nodes={nodes} edges={edges} width={400} height={200} nodeTypes={nodeTypes} style={style}>
        <Background />
      </ReactFlowStatic>
    </>
  );
};

export default () => (
  <>
    default with style
    <BasicFlow nodes={nodesA} edges={edgesA} style={{ border: '1px solid #dedede' }} id="1" />
    custom node
    <BasicFlow nodes={nodesB} edges={edgesB} />
    no handles defined
    <BasicFlow nodes={nodesC} edges={edgesC} />
    {/* no node dimensions defined
    <BasicFlow nodes={nodesD} edges={edgesD} id="4" /> */}
  </>
);
