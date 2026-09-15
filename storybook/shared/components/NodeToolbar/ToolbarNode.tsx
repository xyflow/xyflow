import { memo } from 'react';
import { Handle, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/react';

import type { ToolbarNodeData } from './config';

const positionMap: Record<string, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

function ToolbarNode({ data }: NodeProps<Node<ToolbarNodeData>>) {
  const showInternalToolbar = data.renderMode !== 'external';

  return (
    <>
      {showInternalToolbar ? (
        <NodeToolbar
          isVisible={data.isVisible}
          position={positionMap[data.position ?? 'top'] ?? Position.Top}
          offset={data.offset}
          align={data.align}
        >
          <button type="button">delete</button>
          <button type="button">copy</button>
          <button type="button">expand</button>
        </NodeToolbar>
      ) : null}
      {data.label}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default memo(ToolbarNode);
