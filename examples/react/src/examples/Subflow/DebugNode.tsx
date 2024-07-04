import React, { memo, FC, CSSProperties } from 'react';

import { Handle, NodeProps, Position, useInternalNode } from '@xyflow/react';

const infoStyle: CSSProperties = { fontSize: 11 };
const idStyle: CSSProperties = {
  fontSize: 10,
  color: '#888899',
  position: 'absolute',
  top: 2,
  left: 2,
};

const DebugNode: FC<NodeProps> = ({ zIndex, positionAbsoluteX, positionAbsoluteY, id }) => {
  const node = useInternalNode(id)!;

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={idStyle}>{id}</div>
      <div style={infoStyle}>
        x:{Math.round(positionAbsoluteX)} y:{Math.round(positionAbsoluteY)} z:{zIndex}
      </div>
      <div style={infoStyle}>
        x:{Math.round(node.position.x)} y:{Math.round(node.position.y)}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(DebugNode);
