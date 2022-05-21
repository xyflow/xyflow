import React, { memo } from 'react';

import Handle from '../../components/Handle';
import { NodeProps, Position } from '../../types';

const DefaultNode = ({
  id,
  data,
  isConnectable,
  targetPosition = Position.Top,
  sourcePosition = Position.Bottom,
}: NodeProps) => {
  console.log('render', id);

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
