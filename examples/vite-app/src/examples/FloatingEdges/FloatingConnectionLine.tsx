import React, { FC } from 'react';
import { getBezierPath, ConnectionLineComponentProps, Node } from 'reactflow';

import { getEdgeParams } from './utils';

const FloatingConnectionLine: FC<ConnectionLineComponentProps> = ({ toX, toY, fromPosition, toPosition, fromNode }) => {
  if (!fromNode) {
    return null;
  }

  const toNode = {
    id: 'connection-target',
    width: 1,
    height: 1,
    position: { x: toX, y: toY },
    positionAbsolute: { x: toX, y: toY },
  } as Node;

  const { sx, sy } = getEdgeParams(fromNode, toNode);
  const [d] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: fromPosition,
    targetPosition: toPosition,
    targetX: toX,
    targetY: toY,
  });

  return (
    <g>
      <path fill="none" stroke="#222" strokeWidth={1.5} className="animated" d={d} />
      <circle cx={toX} cy={toY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
    </g>
  );
};

export default FloatingConnectionLine;
