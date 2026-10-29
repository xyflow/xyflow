import { CSSProperties } from 'react';
import { EdgeProps, getBezierPath, useInternalNode } from '@xyflow/react';

import { getEdgeParams } from './utils';

function FloatingEdge({ id, source, target, style }: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

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
}

export default FloatingEdge;
