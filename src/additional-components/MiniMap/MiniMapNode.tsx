import React from 'react';

import { Node } from '../../types';

interface MiniMapNodeProps {
  node: Node;
  color: string;
  borderRadius: number;
}

const MiniMapNode = ({ node, color, borderRadius }: MiniMapNodeProps) => {
  const {
    position: { x, y },
    width,
    height,
  } = node.__rg;
  const { background, backgroundColor } = node.style || {};
  const fill = (background || backgroundColor || color) as string;
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
};

MiniMapNode.displayName = 'MiniMapNode';

export default MiniMapNode;
