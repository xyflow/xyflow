import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { initialNodes, initialEdges, type Props } from './data';

export default function BasicFlow(props: Props) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      className={props.classNames}
      nodeDragThreshold={props.nodeDragThreshold}
      minZoom={props.minZoom}
      maxZoom={props.maxZoom}
      panOnDrag={props.panOnDrag}
      panOnScroll={props.panOnScroll}
      zoomOnScroll={props.zoomOnScroll}
      fitView
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
    </ReactFlow>
  );
}
