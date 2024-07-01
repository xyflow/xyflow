// Reconnectable edges have a anchors around their handles to reconnect the edge.
import { XYHandle, type Connection, EdgePosition } from '@xyflow/system';

import { EdgeAnchor } from '../Edges/EdgeAnchor';
import type { EdgeWrapperProps, Edge } from '../../types/edges';
import { useStoreApi } from '../../hooks/useStore';

type EdgeUpdateAnchorsProps<EdgeType extends Edge = Edge> = {
  edge: EdgeType;
  isReconnectable: boolean | 'source' | 'target';
  reconnectRadius: EdgeWrapperProps['reconnectRadius'];
  sourceHandleId: Edge['sourceHandle'];
  targetHandleId: Edge['targetHandle'];
  onReconnect: EdgeWrapperProps<EdgeType>['onReconnect'];
  onReconnectStart: EdgeWrapperProps<EdgeType>['onReconnectStart'];
  onReconnectEnd: EdgeWrapperProps<EdgeType>['onReconnectEnd'];
  setUpdateHover: (hover: boolean) => void;
  setReconnecting: (updating: boolean) => void;
} & EdgePosition;

export function EdgeUpdateAnchors<EdgeType extends Edge = Edge>({
  isReconnectable,
  reconnectRadius,
  edge,
  targetHandleId,
  sourceHandleId,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  onReconnect,
  onReconnectStart,
  onReconnectEnd,
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
    onReconnectStart?.(event, edge, handleType);

    const _onReconnectEnd = (evt: MouseEvent | TouchEvent) => {
      setReconnecting(false);
      onReconnectEnd?.(evt, edge, handleType);
    };

    const onConnectEdge = (connection: Connection) => onReconnect?.(edge, connection);

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
      onReconnectEnd: _onReconnectEnd,
      updateConnection,
      getTransform: () => store.getState().transform,
      getFromHandle: () => store.getState().connection.fromHandle,
    });
  };

  const onReconnectSourceMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
    handleEdgeUpdater(event, true);
  const onReconnectTargetMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
    handleEdgeUpdater(event, false);
  const onReconnectMouseEnter = () => setUpdateHover(true);
  const onReconnectMouseOut = () => setUpdateHover(false);

  return (
    <>
      {(isReconnectable === 'source' || isReconnectable === true) && (
        <EdgeAnchor
          position={sourcePosition}
          centerX={sourceX}
          centerY={sourceY}
          radius={reconnectRadius}
          onMouseDown={onReconnectSourceMouseDown}
          onMouseEnter={onReconnectMouseEnter}
          onMouseOut={onReconnectMouseOut}
          type="source"
        />
      )}
      {(isReconnectable === 'target' || isReconnectable === true) && (
        <EdgeAnchor
          position={targetPosition}
          centerX={targetX}
          centerY={targetY}
          radius={reconnectRadius}
          onMouseDown={onReconnectTargetMouseDown}
          onMouseEnter={onReconnectMouseEnter}
          onMouseOut={onReconnectMouseOut}
          type="target"
        />
      )}
    </>
  );
}
