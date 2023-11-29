import React, { memo, FC, CSSProperties } from 'react';

import { Handle, NodeProps, Position } from '@xyflow/react';

const infoStyle: CSSProperties = { fontSize: 11 };
const idStyle: CSSProperties = {
  fontSize: 10,
  color: '#888899',
  position: 'absolute',
  top: 2,
  left: 2,
};

const DebugNode: FC<NodeProps> = ({ zIndex, positionAbsolute, id }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={idStyle}>{id}</div>
      <div style={infoStyle}>
        x:{Math.round(positionAbsolute.x)} y:{Math.round(positionAbsolute.y)} z:{zIndex}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(DebugNode);
