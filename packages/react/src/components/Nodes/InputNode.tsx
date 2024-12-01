import { Position } from '@xyflow/system';

import { Handle } from '../../components/Handle';
import type { LabeledBuiltInNode, NodeProps } from '../../types/nodes';

export function InputNode({ data, isConnectable, sourcePosition = Position.Bottom }: NodeProps<LabeledBuiltInNode>) {
  return (
    <>
      {data?.label}
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
    </>
  );
}
