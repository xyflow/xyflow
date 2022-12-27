import { memo } from 'react';

import Handle from '../../components/Handle';
import { Position } from '../../types';
import type { NodeProps } from '../../types';

const InputNode = ({ data, isConnectable, sourcePosition = Position.Bottom }: NodeProps) => (
  <>
    {data?.label}
    <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
  </>
);

InputNode.displayName = 'InputNode';

export default memo(InputNode);
