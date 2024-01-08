import { memo } from 'react';
import cc from 'classcat';

import type { MiniMapNodeProps } from './types';

function MiniMapNodeComponent({
  id,
  x,
  y,
  width,
  height,
  style,
  color,
  strokeColor,
  strokeWidth,
  className,
  borderRadius,
  shapeRendering,
  selected,
  onClick,
}: MiniMapNodeProps) {
  const { background, backgroundColor } = style || {};
  const fill = (color || background || backgroundColor) as string;

  return (
    <rect
      className={cc(['react-flow__minimap-node', { selected }, className])}
      x={x}
      y={y}
      rx={borderRadius}
      ry={borderRadius}
      width={width}
      height={height}
      style={{
        fill,
        stroke: strokeColor,
        strokeWidth,
      }}
      shapeRendering={shapeRendering}
      onClick={onClick ? (event) => onClick(event, id) : undefined}
    />
  );
}

export const MiniMapNode = memo(MiniMapNodeComponent);
