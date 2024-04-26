import { Position } from '@xyflow/system';

import { Handle } from '../Handle';
import type { BuiltInNode, NodeProps } from '../../types/nodes';
import { mergeProps } from 'solid-js';

export function DefaultNode(_p: NodeProps<BuiltInNode>) {
  const p = mergeProps(
    {
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
    },
    _p
  );

  return (
    <>
      <Handle type="target" position={p.targetPosition} isConnectable={p.isConnectable} />
      {p.data?.label}
      <Handle type="source" position={p.sourcePosition} isConnectable={p.isConnectable} />
    </>
  );
}
