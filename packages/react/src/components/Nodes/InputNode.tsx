import { Position, type NodeProps } from '@xyflow/system';

import { Handle } from '../../components/Handle';

export function InputNode({ data, isConnectable, sourcePosition = Position.Bottom }: NodeProps) {
  return (
    <>
      {data?.label}
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
    </>
  );
}
