import { Position } from '@xyflow/system';

import { Handle } from '../../components/Handle';
import type { BuiltInNode, NodeProps } from '../../types/nodes';

export function OutputNode({ data, isConnectable, targetPosition = Position.Top }: NodeProps<BuiltInNode>) {
  return (
    <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
      {data?.label}
    </>
  );
}
