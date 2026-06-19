import type { Connection, ConnectionState, FinalConnectionState, HandleType, IsValidConnection as SystemIsValidConnection } from '@xyflow/system';
import type { MaybeRefOrGetter } from 'vue';
import type { ConnectingHandle, InternalNode, MouseTouchEvent, ValidConnectionFunc } from '../types';
import { getEventPosition, getHostForElement, Position, XYHandle } from '@xyflow/system';
import { toValue } from 'vue';
import { isValidHandle } from '../utils';
import { useStore } from './useStore';
import { useVueFlow } from './useVueFlow';

export interface UseHandleProps {
  handleId: MaybeRefOrGetter<string | null>;
  nodeId: MaybeRefOrGetter<string>;
  type: MaybeRefOrGetter<HandleType>;
  isValidConnection?: MaybeRefOrGetter<ValidConnectionFunc | null>;
  reconnectHandleType?: MaybeRefOrGetter<HandleType>;
  onReconnectStart?: (event: MouseTouchEvent) => void;
  onReconnect?: (event: MouseTouchEvent, connection: Connection) => void;
  onReconnectEnd?: (event: MouseTouchEvent, connectionState: FinalConnectionState<InternalNode>) => void;
}

function alwaysValid() {
  return true;
}

/**
 * Connection-drag composable. Drag-to-connect is delegated to `@xyflow/system`'s `XYHandle` instance
 * (same pattern as `XYDrag` / `XYResizer`). Click-to-connect stays vue-flow specific because the click
 * path interacts with the richer `ValidConnectionFunc` signature (which receives full source/target
 * `InternalNode`s on top of the bare `Connection`).
 *
 * Generally it's recommended to use the `<Handle />` component instead of this composable.
 *
 * @public
 */
export function useHandle({
  handleId,
  nodeId,
  type,
  isValidConnection,
  reconnectHandleType,
  onReconnectStart,
  onReconnect,
  onReconnectEnd,
}: UseHandleProps) {
  const { id: flowId, getNode, getInternalNode, panBy, startConnection, updateConnection, endConnection, emits } = useVueFlow();

  // Read the reactive store directly — every store value below is read inside an event handler or a lazy
  // callback (getTransform/getFromHandle/getStoreItems), so `store.x` yields the current value with the
  // same reactivity; no per-handle ref projection needed.
  const store = useStore();

  const { nodeLookup } = store;

  /**
   * Adapt our richer `ValidConnectionFunc` (which receives `{ nodes, edges, sourceNode, targetNode }`)
   * into system's bare `IsValidConnection` (which only receives the `Connection`/`EdgeBase`). Resolves
   * source/target nodes from `nodeLookup` before delegating to the user's callback.
   */
  function buildSystemIsValidConnection(): SystemIsValidConnection | undefined {
    const userFn = toValue(isValidConnection) || store.isValidConnection;
    if (!userFn) {
      return undefined;
    }
    return (edge) => {
      const sourceNode = getInternalNode(edge.source);
      const targetNode = getInternalNode(edge.target);
      if (!sourceNode || !targetNode) {
        return false;
      }
      return userFn(
        {
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle ?? null,
          targetHandle: edge.targetHandle ?? null,
        },
        { nodes: store.nodes, edges: store.edges, sourceNode, targetNode },
      );
    };
  }

  function handlePointerDown(event: MouseTouchEvent) {
    const handleDomNode = event.currentTarget as Element | null;
    if (!handleDomNode || !store.vueFlowRef) {
      return;
    }

    XYHandle.onPointerDown(event, {
      autoPanOnConnect: store.autoPanOnConnect,
      connectionMode: store.connectionMode,
      connectionRadius: store.connectionRadius,
      domNode: store.vueFlowRef as HTMLDivElement,
      handleId: toValue(handleId),
      nodeId: toValue(nodeId),
      isTarget: toValue(type) === 'target',
      nodeLookup,
      lib: 'vue',
      flowId,
      // system's own param name stays `edgeUpdaterType`; our prop is `reconnectHandleType`
      edgeUpdaterType: toValue(reconnectHandleType),
      autoPanSpeed: store.autoPanSpeed,
      dragThreshold: store.connectionDragThreshold,
      handleDomNode,
      panBy,
      isValidConnection: buildSystemIsValidConnection(),
      getTransform: () => store.transform,
      // system aborts the move loop if this returns null, so once `startConnection` has populated the
      // store's `connectionStartHandle`, surface it as a system-shaped `Handle`. Width/height aren't
      // tracked on `ConnectingHandle` — fall back to 0; system only reads them for rendering.
      getFromHandle: () => {
        const h = store.connectionStartHandle;
        if (!h) {
          return null;
        }
        return {
          id: h.id,
          nodeId: h.nodeId,
          type: h.type,
          position: h.position,
          x: h.x,
          y: h.y,
          width: 0,
          height: 0,
        };
      },
      updateConnection: (state: ConnectionState) => {
        if (state.inProgress) {
          // first move emits the in-progress state — mirror it to our split-field store so consumers
          // like `useConnection` and `Pane.vue`'s `connectionInProgress` keep working.
          if (!store.connectionStartHandle) {
            startConnection({
              nodeId: state.fromHandle.nodeId,
              id: state.fromHandle.id ?? null,
              type: state.fromHandle.type,
              position: state.fromHandle.position,
              x: state.to.x,
              y: state.to.y,
            });
          }
          // `connectionPosition` tracks the raw pointer (not the snapped `to`): `useConnection` derives the
          // snapped end from `connectionEndHandle`, and the connection line snaps via the same handle, so
          // storing the raw pointer here surfaces it as `pointer` (xyflow/react #5594/#5578).
          updateConnection(
            state.pointer,
            state.toHandle
              ? ({
                  nodeId: state.toHandle.nodeId,
                  id: state.toHandle.id ?? null,
                  type: state.toHandle.type,
                  position: state.toHandle.position,
                  x: state.toHandle.x,
                  y: state.toHandle.y,
                } as ConnectingHandle)
              : null,
            state.isValid !== null ? (state.isValid ? 'valid' : 'invalid') : null,
          );
        }
      },
      cancelConnection: () => {
        endConnection(event, false);
      },
      onConnectStart: (evt, params) => {
        emits.connectStart({
          event: evt as MouseTouchEvent,
          nodeId: params.nodeId ?? undefined,
          handleId: params.handleId,
          handleType: params.handleType ?? undefined,
        });
        // For a reconnect this fires only once the drag actually begins (after `connectionDragThreshold`,
        // or immediately when it's 0) — the cue to hide the original edge. Hiding it eagerly on pointerdown
        // would strand a plain click (no drag) with a permanently hidden edge, because the system fires
        // onConnectEnd/onReconnectEnd only after the drag has started.
        if (reconnectHandleType) {
          onReconnectStart?.(evt as MouseTouchEvent);
        }
      },
      onConnect: (connection) => {
        if (onReconnect) {
          onReconnect(event, connection);
        }
        else {
          emits.connect(connection);
        }
      },
      onConnectEnd: (evt, connectionState) => {
        emits.connectEnd({ event: evt as MouseTouchEvent, connectionState });
        if (reconnectHandleType) {
          onReconnectEnd?.(evt as MouseTouchEvent, connectionState);
        }
      },
    });
  }

  function handleClick(event: MouseEvent) {
    if (!store.connectOnClick) {
      return;
    }

    if (!store.connectionClickStartHandle) {
      emits.clickConnectStart({
        event,
        nodeId: toValue(nodeId),
        handleId: toValue(handleId),
      });

      startConnection(
        {
          nodeId: toValue(nodeId),
          type: toValue(type),
          id: toValue(handleId),
          position: Position.Top,
          ...getEventPosition(event),
        },
        undefined,
        true,
      );

      return;
    }

    const isValidConnectionHandler = toValue(isValidConnection) || store.isValidConnection || alwaysValid;

    const node = getNode(toValue(nodeId));

    if (node && (typeof node.connectable === 'undefined' ? store.nodesConnectable : node.connectable) === false) {
      return;
    }

    const doc = getHostForElement(event.target as HTMLElement);

    const result = isValidHandle(
      event,
      {
        handle: {
          nodeId: toValue(nodeId),
          id: toValue(handleId),
          type: toValue(type),
          position: Position.Top,
          ...getEventPosition(event),
        },
        connectionMode: store.connectionMode,
        fromNodeId: store.connectionClickStartHandle.nodeId,
        fromHandleId: store.connectionClickStartHandle.id ?? null,
        fromType: store.connectionClickStartHandle.type,
        isValidConnection: isValidConnectionHandler,
        doc,
        lib: 'vue',
        flowId,
      },
      store.edges,
      store.nodes,
      getInternalNode,
      nodeLookup,
    );

    const isOwnHandle = result.connection?.source === result.connection?.target;

    if (result.isValid && result.connection && !isOwnHandle) {
      emits.connect(result.connection);
    }

    // the click path doesn't drive the system's connection state machine, so assemble the
    // `FinalConnectionState` ourselves from the click-start handle + the resolved end handle, so
    // `clickConnectEnd` carries the same payload shape as `connectEnd` (handles → system `Handle`s by
    // padding the missing width/height, as `getFromHandle` does above).
    const fromHandle = store.connectionClickStartHandle;
    const fromNode = fromHandle ? getInternalNode(fromHandle.nodeId) : undefined;
    const toHandle = result.toHandle;
    const pointer = getEventPosition(event);
    const connectionState: FinalConnectionState<InternalNode>
      = fromHandle && fromNode
        ? {
            isValid: result.isValid,
            from: { x: fromHandle.x, y: fromHandle.y },
            fromHandle: { ...fromHandle, width: 0, height: 0 },
            fromPosition: fromHandle.position,
            fromNode,
            to: toHandle ? { x: toHandle.x, y: toHandle.y } : pointer,
            toHandle: toHandle ? { ...toHandle, width: 0, height: 0 } : null,
            toPosition: toHandle?.position ?? null,
            toNode: toHandle ? (getInternalNode(toHandle.nodeId) ?? null) : null,
            pointer,
          }
        : {
            isValid: null,
            from: null,
            fromHandle: null,
            fromPosition: null,
            fromNode: null,
            to: null,
            toHandle: null,
            toPosition: null,
            toNode: null,
            pointer: null,
          };

    emits.clickConnectEnd({ event, connectionState });

    endConnection(event, true);
  }

  return {
    handlePointerDown,
    handleClick,
  };
}
