import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type OnNodeDrag,
  type OnNodesChange,
  type OnNodesDelete,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

export interface NodeEventsProps {
  onNodeClick?: NodeMouseHandler<Node>;
  onNodeDoubleClick?: NodeMouseHandler<Node>;
  onNodeDragStart?: OnNodeDrag<Node>;
  onNodeDrag?: OnNodeDrag<Node>;
  onNodeDragStop?: OnNodeDrag<Node>;
  onNodeMouseEnter?: NodeMouseHandler<Node>;
  onNodeMouseMove?: NodeMouseHandler<Node>;
  onNodeMouseLeave?: NodeMouseHandler<Node>;
  onNodeContextMenu?: NodeMouseHandler<Node>;
  onNodesDelete?: OnNodesDelete<Node>;
  onNodesChange?: OnNodesChange<Node>;
}

const initialNodes: Node[] = [
  { id: '1', type: 'input', data: { label: 'Node 1' }, position: { x: 100, y: 50 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 300, y: 150 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 500, y: 50 } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function NodeEvents(props: NodeEventsProps) {
  const noopMouse: NodeMouseHandler<Node> = () => {};
  const noopDrag: OnNodeDrag<Node> = () => {};
  const noopNodesDelete: OnNodesDelete<Node> = () => {};
  const noopNodesChange: OnNodesChange<Node> = () => {};

  const onNodeClick = props.onNodeClick || noopMouse;
  const onNodeDoubleClick = props.onNodeDoubleClick || noopMouse;
  const onNodeDragStart = props.onNodeDragStart || noopDrag;
  const onNodeDrag = props.onNodeDrag || noopDrag;
  const onNodeDragStop = props.onNodeDragStop || noopDrag;
  const onNodeMouseEnter = props.onNodeMouseEnter || noopMouse;
  const onNodeMouseMove = props.onNodeMouseMove || noopMouse;
  const onNodeMouseLeave = props.onNodeMouseLeave || noopMouse;
  const onNodeContextMenu = props.onNodeContextMenu || noopMouse;
  const onNodesDelete = props.onNodesDelete || noopNodesDelete;
  const onNodesChange = props.onNodesChange || noopNodesChange;

  return (
    <ReactFlow
      defaultNodes={initialNodes}
      defaultEdges={initialEdges}
      onNodeClick={onNodeClick}
      onNodeDoubleClick={onNodeDoubleClick}
      onNodeDragStart={onNodeDragStart}
      onNodeDrag={onNodeDrag}
      onNodeDragStop={onNodeDragStop}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseMove={onNodeMouseMove}
      onNodeMouseLeave={onNodeMouseLeave}
      onNodeContextMenu={onNodeContextMenu}
      onNodesDelete={onNodesDelete}
      onNodesChange={onNodesChange}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
    </ReactFlow>
  );
}
