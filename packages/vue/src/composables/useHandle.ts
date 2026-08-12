import type { Connection, FinalConnectionState, HandleType, IsValidConnection } from '@xyflow/system';
import type { MaybeRefOrGetter } from 'vue';
import type { InternalNode, MouseTouchEvent } from '../types';
import { getEventPosition, getHostForElement, Position, XYHandle } from '@xyflow/system';
import { toValue } from 'vue';
import { useStore } from './useStore';
import { useVueFlow } from './useVueFlow';

export interface UseHandleProps {
  handleId: MaybeRefOrGetter<string | null>;
  nodeId: MaybeRefOrGetter<string>;
  type: MaybeRefOrGetter<HandleType>;
  isValidConnection?: MaybeRefOrGetter<IsValidConnection | null>;
  reconnectHandleType?: MaybeRefOrGetter<HandleType>;
  onReconnectStart?: (event: MouseTouchEvent) => void;
  onReconnect?: (event: MouseTouchEvent, connection: Connection) => void;
  onReconnectEnd?: (event: MouseTouchEvent, connectionState: FinalConnectionState<InternalNode>) => void;
}

/**
 * Composable powering drag- and click-to-connect. Drag-to-connect delegates to `@xyflow/system`'s
 * `XYHandle`; click-to-connect is handled here (it validates via `XYHandle.isValid` and builds the
 * `clickConnect*` payloads itself).
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
  const { id: flowId, getNode, getInternalNode, panBy, updateConnection, cancelConnection, emits } = useVueFlow();

  const store = useStore();

  const { nodeLookup } = store;

  function getIsValidConnection(): IsValidConnection | undefined {
    return toValue(isValidConnection) || store.isValidConnection || undefined;
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
      domNode: store.vueFlowRef,
      handleId: toValue(handleId),
      nodeId: toValue(nodeId),
      isTarget: toValue(type) === 'target',
      nodeLookup,
      lib: 'vue',
      flowId,
      edgeUpdaterType: toValue(reconnectHandleType),
      autoPanSpeed: store.autoPanSpeed,
      dragThreshold: store.connectionDragThreshold,
      handleDomNode,
      panBy,
      isValidConnection: getIsValidConnection(),
      getTransform: () => store.transform,
      getFromHandle: () => (store.connection.inProgress ? store.connection.fromHandle : null),
      updateConnection,
      cancelConnection,
      onConnectStart: (evt, params) => {
        emits.connectStart({
          event: evt,
          nodeId: params.nodeId,
          handleId: params.handleId,
          handleType: params.handleType,
        });

        if (reconnectHandleType) {
          onReconnectStart?.(evt);
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
        emits.connectEnd({ event: evt, connectionState });
        if (reconnectHandleType) {
          onReconnectEnd?.(evt, connectionState);
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
        handleType: toValue(type),
      });

      store.connectionClickStartHandle = {
        nodeId: toValue(nodeId),
        type: toValue(type),
        id: toValue(handleId),
        position: Position.Top,
        ...getEventPosition(event),
      };

      return;
    }

    const node = getNode(toValue(nodeId));

    if (node && (typeof node.connectable === 'undefined' ? store.nodesConnectable : node.connectable) === false) {
      return;
    }

    const doc = getHostForElement(event.target as HTMLElement);

    const result = XYHandle.isValid(event, {
      handle: {
        nodeId: toValue(nodeId),
        id: toValue(handleId),
        type: toValue(type),
      },
      connectionMode: store.connectionMode,
      fromNodeId: store.connectionClickStartHandle.nodeId,
      fromHandleId: store.connectionClickStartHandle.id ?? null,
      fromType: store.connectionClickStartHandle.type,
      isValidConnection: getIsValidConnection(),
      doc,
      lib: 'vue',
      flowId,
      nodeLookup,
    });

    const isOwnHandle = result.connection?.source === result.connection?.target;

    if (result.isValid && result.connection && !isOwnHandle) {
      emits.connect(result.connection);
    }

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

    store.connectionClickStartHandle = null;
  }

  return {
    handlePointerDown,
    handleClick,
  };
}
