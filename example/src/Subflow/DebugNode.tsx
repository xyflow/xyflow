import { memo, FC, CSSProperties } from 'react';

import { Handle, NodeProps, Position } from 'react-flow-renderer';

const infoStyle: CSSProperties = { fontSize: 11 };
const idStyle: CSSProperties = {
  fontSize: 10,
  color: '#888899',
  position: 'absolute',
  top: 2,
  left: 2,
};

const ColorSelectorNode: FC<NodeProps> = ({ zIndex, xPos, yPos, id }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={idStyle}>{id}</div>
      <div style={infoStyle}>
        x:{Math.round(xPos || 0)} y:{Math.round(yPos || 0)} z:{zIndex}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(ColorSelectorNode);
