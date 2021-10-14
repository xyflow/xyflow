import { FC } from 'react';
import { getBezierPath, ConnectionLineComponentProps } from 'react-flow-renderer';

import { getArrow } from './utils';

const FloatingConnectionLine: FC<ConnectionLineComponentProps> = ({
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  sourceNode,
}) => {
  if (!sourceNode) {
    return null;
  }

  const targetNode = { __rf: { width: 1, height: 1, position: { x: targetX, y: targetY } } };
  const { sx, sy } = getArrow(sourceNode, targetNode);
  const d = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  return (
    <g>
      <path fill="none" stroke="#222" strokeWidth={1.5} className="animated" d={d} />
      <circle cx={targetX} cy={targetY} fill="#fff" r={3} stroke="#222" strokeWidth={1.5} />
    </g>
  );
};

export default FloatingConnectionLine;
