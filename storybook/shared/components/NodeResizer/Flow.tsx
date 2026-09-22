import { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  CoordinateExtent,
} from '@xyflow/react';

import DefaultResizer from './DefaultResizer';
import CustomResizer from './CustomResizer';
import VerticalResizer from './VerticalResizer';
import HorizontalResizer from './HorizontalResizer';
import BottomRightResizer from './BottomRightResizer';
import FixedExtentNode from './FixedExtentNode';

const nodeTypes = {
  defaultResizer: DefaultResizer,
  customResizer: CustomResizer,
  verticalResizer: VerticalResizer,
  horizontalResizer: HorizontalResizer,
  bottomRightResizer: BottomRightResizer,
  fixedExtent: FixedExtentNode,
};

import { initialNodes, initialEdges } from './config';

export type NodeResizerExampleProps = {
  snapToGrid?: boolean;
};

export function NodeResizerExample({ snapToGrid = false }: NodeResizerExampleProps) {
  const [nodes, , onNodesChange] = useNodesState<Node>(structuredClone(initialNodes) as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(structuredClone(initialEdges) as Edge[]);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection }, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      minZoom={0.2}
      maxZoom={5}
      snapToGrid={snapToGrid}
      snapGrid={[10, 10]}
      fitView
      onlyRenderVisibleElements
    >
      <Controls />
    </ReactFlow>
  );
}

export default NodeResizerExample;
