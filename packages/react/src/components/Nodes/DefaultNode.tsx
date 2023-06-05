import { memo } from 'react';
import { Position, type NodeProps } from '@xyflow/system';

import Handle from '../../components/Handle';

const DefaultNode = ({
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {
  return (
    <>
      <Handle type="target" position={targetPosition} isConnectable={isConnectable} />
      {data?.label}
      <Handle type="source" position={sourcePosition} isConnectable={isConnectable} />
    </>
  );
};

DefaultNode.displayName = 'DefaultNode';

export default memo(DefaultNode);
