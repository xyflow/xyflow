import { Position, type NodeProps } from '@xyflow/system';

import { Handle } from '../../components/Handle';

export function OutputNode({ data, isConnectable, targetPosition = Position.Top }: NodeProps) {
  return (
    <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
      {data?.label}
    </>
  );
}
