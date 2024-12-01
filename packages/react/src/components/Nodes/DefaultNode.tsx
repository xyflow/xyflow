import { Position } from '@xyflow/system';

import { Handle } from '../../components/Handle';
import type { LabeledBuiltInNode, NodeProps } from '../../types/nodes';

export function DefaultNode({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps<LabeledBuiltInNode>) {
  return (
    <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
      {data?.label}
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
    </>
  );
}
