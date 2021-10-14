import { FC, useMemo, CSSProperties } from 'react';
import { EdgeProps, getMarkerEnd, useStoreState, getBezierPath } from 'react-flow-renderer';

import { getEdgeParams } from './utils';

const FloatingEdge: FC<EdgeProps> = ({ id, source, target, arrowHeadType, markerEndId, style }) => {
  const nodes = useStoreState((state) => state.nodes);
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

  const sourceNode = useMemo(() => nodes.find((n) => n.id === source), [source, nodes]);
  const targetNode = useMemo(() => nodes.find((n) => n.id === target), [target, nodes]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

  const d = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <g className="react-flow__connection">
      <path id={id} className="react-flow__edge-path" d={d} markerEnd={markerEnd} style={style as CSSProperties} />
    </g>
  );
};

export default FloatingEdge;
