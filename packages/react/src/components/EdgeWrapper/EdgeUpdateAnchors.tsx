// Reconnectable edges have anchors around their handles to reconnect the edge.
import type { EdgePosition, HandleType } from '@xyflow/system';

import type { EdgeReconnectHandler } from '../../contexts/EdgeReconnectContext';
import { EdgeAnchor } from '../Edges/EdgeAnchor';

type EdgeUpdateAnchorsProps = {
  isReconnectable: boolean | HandleType;
  reconnectRadius?: number;
  startReconnect: EdgeReconnectHandler;
  setUpdateHover: (hover: boolean) => void;
} & EdgePosition;

export function EdgeUpdateAnchors({
  isReconnectable,
  reconnectRadius,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  startReconnect,
  setUpdateHover,
}: EdgeUpdateAnchorsProps) {
  const onReconnectMouseEnter = () => setUpdateHover(true);
  const onReconnectMouseOut = () => setUpdateHover(false);

  return (
    <>
      {(isReconnectable === true || isReconnectable === 'source') && (
        <EdgeAnchor
          position={sourcePosition}
          centerX={sourceX}
          centerY={sourceY}
          radius={reconnectRadius}
          onMouseDown={(event) => startReconnect(event, 'source')}
          onMouseEnter={onReconnectMouseEnter}
          onMouseOut={onReconnectMouseOut}
          type="source"
        />
      )}
      {(isReconnectable === true || isReconnectable === 'target') && (
        <EdgeAnchor
          position={targetPosition}
          centerX={targetX}
          centerY={targetY}
          radius={reconnectRadius}
          onMouseDown={(event) => startReconnect(event, 'target')}
          onMouseEnter={onReconnectMouseEnter}
          onMouseOut={onReconnectMouseOut}
          type="target"
        />
      )}
    </>
  );
}
