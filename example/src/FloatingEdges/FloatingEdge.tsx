import { FC, useMemo, CSSProperties } from 'react';
import { EdgeProps, useStore, getBezierPath, ReactFlowState } from 'react-flow-renderer';

import { getEdgeParams } from './utils';

const nodeSelector = (s: ReactFlowState) => s.nodes;

const FloatingEdge: FC<EdgeProps> = ({ id, source, target, style }) => {
  const nodes = useStore(nodeSelector);

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
      <path id={id} className="react-flow__edge-path" d={d} style={style as CSSProperties} />
    </g>
  );
};

export default FloatingEdge;
