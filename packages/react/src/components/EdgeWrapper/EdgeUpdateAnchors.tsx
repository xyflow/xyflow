// Reconnectable edges have a anchors around their handles to reconnect the edge.
import {
  XYHandle,
  type EdgePosition,
  type FinalConnectionState,
  type HandleType,
  type OnConnectStart,
  type Connection,
} from '@xyflow/system';

import { EdgeAnchor } from '../Edges/EdgeAnchor';
import type { EdgeWrapperProps, Edge } from '../../types/edges';
import { useStoreApi } from '../../hooks/useStore';

type EdgeUpdateAnchorsProps<EdgeType extends Edge = Edge> = {
  edge: EdgeType;
  isReconnectable: boolean | 'source' | 'target';
  reconnectRadius: EdgeWrapperProps['reconnectRadius'];
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

  const handleEdgeUpdater = (
    event: React.MouseEvent<SVGGElement, MouseEvent>,
    oppositeHandle: { nodeId: string; id: string | null; type: HandleType }
  ) => {
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
    const isTarget = oppositeHandle.type === 'target';

    const _onReconnectEnd = (evt: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      setReconnecting(false);
      onReconnectEnd?.(evt, edge, oppositeHandle.type, connectionState);
    };

    const onConnectEdge = (connection: Connection) => onReconnect?.(edge, connection);
    const _onConnectStart: OnConnectStart = (_event, params) => {
      setReconnecting(true);
      onReconnectStart?.(event, edge, oppositeHandle.type);
      onConnectStart?.(_event, params);
    };

    XYHandle.onPointerDown(event.nativeEvent, {
      autoPanOnConnect,
      connectionMode,
      connectionRadius,
      domNode,
      handleId: oppositeHandle.id,
      nodeId: oppositeHandle.nodeId,
      nodeLookup,
      isTarget,
      edgeUpdaterType: oppositeHandle.type,
      lib,
      flowId,
      cancelConnection,
      panBy,
      isValidConnection,
      onConnect: onConnectEdge,
      onConnectStart: _onConnectStart,
      onConnectEnd,
      onReconnectEnd: _onReconnectEnd,
      updateConnection,
      getTransform: () => store.getState().transform,
      getFromHandle: () => store.getState().connection.fromHandle,
      dragThreshold: store.getState().connectionDragThreshold,
      handleDomNode: event.currentTarget,
    });
  };

  const onReconnectSourceMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
    handleEdgeUpdater(event, { nodeId: edge.target, id: edge.targetHandle ?? null, type: 'target' });
  const onReconnectTargetMouseDown = (event: React.MouseEvent<SVGGElement, MouseEvent>): void =>
    handleEdgeUpdater(event, { nodeId: edge.source, id: edge.sourceHandle ?? null, type: 'source' });
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
          onMouseDown={onReconnectSourceMouseDown}
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
          onMouseDown={onReconnectTargetMouseDown}
          onMouseEnter={onReconnectMouseEnter}
          onMouseOut={onReconnectMouseOut}
          type="target"
        />
      )}
    </>
  );
}
