// Updatable edges have a anchors around their handles to update the edge.
import { XYHandle, type Connection, EdgePosition } from '@xyflow/system';

import { EdgeAnchor } from '../Edges/EdgeAnchor';
import type { EdgeWrapperProps, Edge } from '../../types/edges';
import { useStoreApi } from '../../hooks/useStore';
import { Match, Switch } from 'solid-js';
import { SolidEvent } from '../../types';

type EdgeUpdateAnchorsProps<EdgeType extends Edge = Edge> = {
  edge: EdgeType;
  isUpdatable: boolean | 'source' | 'target';
  edgeUpdaterRadius: EdgeWrapperProps['edgeUpdaterRadius'];
  sourceHandleId: Edge['sourceHandle'];
  targetHandleId: Edge['targetHandle'];
  onEdgeUpdate: EdgeWrapperProps<EdgeType>['onEdgeUpdate'];
  onEdgeUpdateStart: EdgeWrapperProps<EdgeType>['onEdgeUpdateStart'];
  onEdgeUpdateEnd: EdgeWrapperProps<EdgeType>['onEdgeUpdateEnd'];
  setUpdateHover: (hover: boolean) => void;
  setUpdating: (updating: boolean) => void;
} & EdgePosition;

export function EdgeUpdateAnchors<EdgeType extends Edge = Edge>(
  p: EdgeUpdateAnchorsProps<EdgeType>
  //   {
  //   isUpdatable,
  //   edgeUpdaterRadius,
  //   edge,
  //   targetHandleId,
  //   sourceHandleId,
  //   sourceX,
  //   sourceY,
  //   targetX,
  //   targetY,
  //   sourcePosition,
  //   targetPosition,
  //   onEdgeUpdate,
  //   onEdgeUpdateStart,
  //   onEdgeUpdateEnd,
  //   setUpdating,
  //   setUpdateHover,
  // }: EdgeUpdateAnchorsProps<EdgeType>) {
) {
  const store = useStoreApi();

  const handleEdgeUpdater = (event: SolidEvent<SVGGElement, MouseEvent>, isSourceHandle: boolean) => {
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
    } = store;
    const nodeId = () => (isSourceHandle ? p.edge.target : p.edge.source);
    const handleId = () => (isSourceHandle ? p.targetHandleId : p.sourceHandleId) || null;
    const handleType = () => (isSourceHandle ? 'target' : 'source');

    const isTarget = isSourceHandle;

    p.setUpdating(true);
    p.onEdgeUpdateStart?.(event, p.edge, handleType());

    const _onEdgeUpdateEnd = (evt: MouseEvent | TouchEvent) => {
      p.setUpdating(false);
      p.onEdgeUpdateEnd?.(evt, p.edge, handleType());
    };

    const onConnectEdge = (connection: Connection) => p.onEdgeUpdate?.(p.edge, connection);

    XYHandle.onPointerDown(event, {
      autoPanOnConnect: autoPanOnConnect.get(),
      connectionMode: connectionMode.get(),
      connectionRadius: connectionRadius.get(),
      domNode: domNode.get(),
      handleId: handleId(),
      nodeId: nodeId(),
      nodeLookup,
      isTarget,
      edgeUpdaterType: handleType(),
      lib: lib.get(),
      flowId: flowId.get(),
      cancelConnection,
      panBy,
      isValidConnection,
      onConnect: onConnectEdge,
      onConnectStart,
      onConnectEnd,
      onEdgeUpdateEnd: _onEdgeUpdateEnd,
      updateConnection,
      getTransform: () => store.transform.get(),
      getConnectionStartHandle: () => store.connectionStartHandle.get(),
    });
  };

  const onEdgeUpdaterSourceMouseDown = (event: SolidEvent<SVGGElement, MouseEvent>): void =>
    handleEdgeUpdater(event, true);
  const onEdgeUpdaterTargetMouseDown = (event: SolidEvent<SVGGElement, MouseEvent>): void =>
    handleEdgeUpdater(event, false);
  const onEdgeUpdaterMouseEnter = () => p.setUpdateHover(true);
  const onEdgeUpdaterMouseOut = () => p.setUpdateHover(false);

  return (
    <Switch>
      <Match when={p.isUpdatable === 'source' || p.isUpdatable === true}>
        <EdgeAnchor
          position={p.sourcePosition}
          centerX={p.sourceX}
          centerY={p.sourceY}
          radius={p.edgeUpdaterRadius}
          onMouseDown={onEdgeUpdaterSourceMouseDown}
          onMouseEnter={onEdgeUpdaterMouseEnter}
          onMouseOut={onEdgeUpdaterMouseOut}
          type="source"
        />
      </Match>

      <Match when={p.isUpdatable === 'target' || p.isUpdatable === true}>
        <EdgeAnchor
          position={p.targetPosition}
          centerX={p.targetX}
          centerY={p.targetY}
          radius={p.edgeUpdaterRadius}
          onMouseDown={onEdgeUpdaterTargetMouseDown}
          onMouseEnter={onEdgeUpdaterMouseEnter}
          onMouseOut={onEdgeUpdaterMouseOut}
          type="target"
        />
      </Match>
    </Switch>
  );
}
