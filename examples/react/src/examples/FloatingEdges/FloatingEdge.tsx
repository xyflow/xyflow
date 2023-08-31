import { FC, CSSProperties } from 'react';
import { EdgeProps, useStore, getBezierPath } from '@xyflow/react';

import { getEdgeParams } from './utils';

const FloatingEdge: FC<EdgeProps> = ({ id, source, target, style }) => {
  const { sourceNode, targetNode } = useStore((s) => {
    const sourceNode = s.nodes.find((n) => n.id === source);
    const targetNode = s.nodes.find((n) => n.id === target);

    return { sourceNode, targetNode };
  });

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const [path] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <g className="react-flow__connection">
      <path id={id} className="react-flow__edge-path" d={path} style={style as CSSProperties} />
    </g>
  );
};

export default FloatingEdge;
