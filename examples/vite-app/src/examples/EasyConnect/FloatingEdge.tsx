import { useCallback } from 'react';
import { useStore, getStraightPath, EdgeProps } from '@xyflow/react';

import { getEdgeParams } from './utils.js';

function FloatingEdge({ id, source, target, markerEnd, style }: EdgeProps) {
  const sourceNode = useStore(useCallback((store) => store.nodes.find((n) => n.id === source), [source]));
  const targetNode = useStore(useCallback((store) => store.nodes.find((n) => n.id === target), [target]));

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return <path id={id} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} style={style} />;
}

export default FloatingEdge;
