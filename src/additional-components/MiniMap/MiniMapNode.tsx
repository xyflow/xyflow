import React, { memo, CSSProperties } from 'react';

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
      className={`react-flow__minimap-node ${className}`}
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
