import { Position } from '@xyflow/system';

import { Handle } from '../Handle';
import type { BuiltInNode, NodeProps } from '../../types/nodes';
import { mergeProps } from 'solid-js';

export function InputNode(_p: NodeProps<BuiltInNode>) {
  const p = mergeProps({ sourcePosition: Position.Bottom }, _p);

  return (
    <>
      {p.data?.label}
      <Handle type="source" position={p.sourcePosition} isConnectable={p.isConnectable} />
    </>
  );
}
