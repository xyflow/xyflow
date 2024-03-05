import { Position } from '@xyflow/system';

import { Handle } from '../../components/Handle';
import type { BuiltInNode, NodeProps } from '../../types/nodes';

export function InputNode({ data, isConnectable, sourcePosition = Position.Bottom }: NodeProps<BuiltInNode>) {
  return (
    <>
      {data?.label}
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
    </>
  );
}
