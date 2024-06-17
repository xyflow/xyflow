// Reconnectable edges have a anchors around their handles to reconnect the edge.
import { XYHandle, type Connection, EdgePosition } from '@xyflow/system';

import { EdgeAnchor } from '../Edges/EdgeAnchor';
import type { EdgeWrapperProps, Edge } from '../../types/edges';
import { useStoreApi } from '../../hooks/useStore';

type EdgeUpdateAnchorsProps<EdgeType extends Edge = Edge> = {
  edge: EdgeType;
  isReconnectable: boolean | 'source' | 'target';
  edgeUpdaterRadius: EdgeWrapperProps['edgeUpdaterRadius'];
  sourceHandleId: Edge['sourceHandle'];
  targetHandleId: Edge['targetHandle'];
  onEdgeUpdate: EdgeWrapperProps<EdgeType>['onEdgeUpdate'];
  onEdgeUpdateStart: EdgeWrapperProps<EdgeType>['onEdgeUpdateStart'];
  onEdgeUpdateEnd: EdgeWrapperProps<EdgeType>['onEdgeUpdateEnd'];
  setUpdateHover: (hover: boolean) => void;
  setReconnecting: (updating: boolean) => void;
} & EdgePosition;

export function EdgeUpdateAnchors<EdgeType extends Edge = Edge>({
  isReconnectable,
  edgeUpdaterRadius,
  edge,
  targetHandleId,
  sourceHandleId,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  onEdgeUpdate,
  onEdgeUpdateStart,
  onEdgeUpdateEnd,
  setReconnecting,
  setUpdateHover,
}: EdgeUpdateAnchorsProps<EdgeType>) {
  const store = useStoreApi();

  const handleEdgeUpdater = (event: React.MouseEvent<SVGGElement, MouseEvent>, isSourceHandle: boolean) => {
    // avoid triggering edge updater if mouse btn is not left
    if (event.button !== 0) {
      return;
    }

    const {
      autoPanOnConnect,
      domNode,
      isValidConnection,
      connectionMode,
      connectionRadius,
      lib,
      onConnectStart,
      onConnectEnd,
      cancelConnection,
      nodeLookup,
      rfId: flowId,
      panBy,
      updateConnection,
    } = store.getState();
    const nodeId = isSourceHandle ? edge.target : edge.source;
    const handleId = (isSourceHandle ? targetHandleId : sourceHandleId) || null;
    const handleType = isSourceHandle ? 'target' : 'source';

    const isTarget = isSourceHandle;

    setReconnecting(true);
    onEdgeUpdateStart?.(event, edge, handleType);

    const _onEdgeUpdateEnd = (evt: MouseEvent | TouchEvent) => {
      setReconnecting(false);
      onEdgeUpdateEnd?.(evt, edge, handleType);
    };

    const onConnectEdge = (connection: Connection) => onEdgeUpdate?.(edge, connection);

    XYHandle.onPointerDown(event.nativeEvent, {
      autoPanOnConnect,
      connectionMode,
      connectionRadius,
      domNode,
      handleId,
      nodeId,
      nodeLookup,
      isTarget,
      edgeUpdaterType: handleType,
      lib,
      flowId,
      cancelConnection,
      panBy,
      isValidConnection,
      onConnect: onConnectEdge,
      onConnectStart,
      onConnectEnd,
      onEdgeUpdateEnd: _onEdgeUpdateEnd,
      updateConnection,
      getTransform: () => store.getState().transform,
      getConnectionStartHandle: () => store.getState().connectionStartHandle,
    });
  };

  const onEdgeUpdaterSourceMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
    handleEdgeUpdater(event, true);
  const onEdgeUpdaterTargetMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
    handleEdgeUpdater(event, false);
  const onEdgeUpdaterMouseEnter = () => setUpdateHover(true);
  const onEdgeUpdaterMouseOut = () => setUpdateHover(false);

  return (
    <>
      {(isReconnectable === 'source' || isReconnectable === true) && (
        <EdgeAnchor
          position={sourcePosition}
          centerX={sourceX}
          centerY={sourceY}
          radius={edgeUpdaterRadius}
          onMouseDown={onEdgeUpdaterSourceMouseDown}
          onMouseEnter={onEdgeUpdaterMouseEnter}
          onMouseOut={onEdgeUpdaterMouseOut}
          type="source"
        />
      )}
      {(isReconnectable === 'target' || isReconnectable === true) && (
        <EdgeAnchor
          position={targetPosition}
          centerX={targetX}
          centerY={targetY}
          radius={edgeUpdaterRadius}
          onMouseDown={onEdgeUpdaterTargetMouseDown}
          onMouseEnter={onEdgeUpdaterMouseEnter}
          onMouseOut={onEdgeUpdaterMouseOut}
          type="target"
        />
      )}
    </>
  );
}
