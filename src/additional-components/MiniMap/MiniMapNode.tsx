import React, { memo, CSSProperties } from 'react';

interface MiniMapNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  borderRadius: number;
  style?: CSSProperties;
}

const MiniMapNode = memo(({ x, y, width, height, style, color, borderRadius }: MiniMapNodeProps) => {
  const { background, backgroundColor } = style || {};
  const fill = (color || background || backgroundColor) as string;

  return (
    <rect
      className="react-flow__minimap-node"
      x={x}
      y={y}
      rx={borderRadius}
      ry={borderRadius}
      width={width}
      height={height}
      fill={fill}
    />
  );
});

MiniMapNode.displayName = 'MiniMapNode';

export default MiniMapNode;
