import React, { memo, CSSProperties } from 'react';
import cc from 'classcat';

interface MiniMapNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  className: string;
  borderRadius: number;
  style?: CSSProperties;
}

const MiniMapNode = ({ x, y, width, height, style, color, className, borderRadius }: MiniMapNodeProps) => {
  const { background, backgroundColor } = style || {};
  const fill = (color || background || backgroundColor) as string;

  return (
    <rect
      className={cc(['react-flow__minimap-node', className])}
      x={x}
      y={y}
      rx={borderRadius}
      ry={borderRadius}
      width={width}
      height={height}
      fill={fill}
    />
  );
};

MiniMapNode.displayName = 'MiniMapNode';

export default memo(MiniMapNode);
