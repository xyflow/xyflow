import { memo } from 'react';
import { Handle, NodeToolbar, Position, type NodeProps } from '@xyflow/react';

const positionMap: Record<string, Position> = {
  top: Position.Top,
  right: Position.Right,
  bottom: Position.Bottom,
  left: Position.Left,
};

function ToolbarNode({ data }: NodeProps) {
  return (
    <>
      <NodeToolbar
        isVisible={typeof data.toolbarVisible === 'boolean' ? data.toolbarVisible : undefined}
        position={positionMap[String(data.toolbarPosition)] ?? Position.Top}
        align={data.toolbarAlign as 'start' | 'center' | 'end' | undefined}
      >
        <button type="button">delete</button>
        <button type="button">copy</button>
        <button type="button">expand</button>
      </NodeToolbar>
      <div>{data.label as string}</div>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </>
  );
}

export default memo(ToolbarNode);
