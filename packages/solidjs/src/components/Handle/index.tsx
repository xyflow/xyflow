import cc from 'classcat';
// import { shallow } from 'zustand/shallow';
import {
  errorMessages,
  Position,
  XYHandle,
  getHostForElement,
  isMouseEvent,
  addEdge,
  type HandleProps as HandlePropsSystem,
  type Connection,
  type HandleType,
  ConnectionMode,
  OnConnect,
  ConnectionState,
  Optional,
} from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import { SolidEvent, type SolidFlowState } from '../../types';
import { createEffect, mergeProps, splitProps, JSX } from 'solid-js';

/**
 * @expand
 */
export type HandleProps = HandlePropsSystem &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, 'id'> & {
    /** Callback called when connection is made */
    onConnect?: OnConnect;
  };

const selector = (s: SolidFlowState) => ({
  connectOnClick: () => s.connectOnClick.get(),
  noPanClassName: () => s.noPanClassName.get(),
  rfId: () => s.rfId.get(),
});

const connectingSelector =
  (nodeId: () => string | null, handleId: () => string | null, type: () => HandleType) => (state: SolidFlowState) => {
    const { connectionClickStartHandle: clickHandle, connectionMode, connection } = state;
    const { fromHandle, toHandle, isValid } = connection.get();
    const connectingTo = () =>
      toHandle?.nodeId === nodeId() && toHandle?.id === handleId() && toHandle?.type === type();

    return {
      connectingFrom: () =>
        fromHandle?.nodeId === nodeId() && fromHandle?.id === handleId() && fromHandle?.type === type(),
      connectingTo,
      clickConnecting: () =>
        clickHandle.get()?.nodeId === nodeId() &&
        clickHandle.get()?.id === handleId() &&
        clickHandle.get()?.type === type(),
      isPossibleEndHandle: () =>
        connectionMode.get() === ConnectionMode.Strict
          ? fromHandle?.type !== type()
          : nodeId() !== fromHandle?.nodeId || handleId() !== fromHandle?.id,
      connectionInProcess: () => !!fromHandle,
      clickConnectionInProcess: () => !!clickHandle.get(),
      valid: () => connectingTo() && isValid,
    };
  };

function HandleComponent(_p: HandleProps) {
  const p = mergeProps(
    {
      type: 'source',
      position: Position.Top,
      isValidConnection: undefined,
      isConnectable: true,
      isConnectableStart: true,
      isConnectableEnd: true,
    },
    _p
  );

  const [_, rest] = splitProps(_p, [
    'type',
    'position',
    'isValidConnection',
    'isConnectable',
    'isConnectableStart',
    'isConnectableEnd',
    'id',
    'onConnect',
    'children',
    'class',
    'onMouseDown',
    'onTouchStart',
  ]);

  const handleId = () => p.id || null;
  const isTarget = () => p.type === 'target';
  const store = useStoreApi();
  const nodeId = useNodeId();
  const storeData = useStore(selector);
  const connectingData = useStore(connectingSelector(nodeId, handleId, () => p.type));

  createEffect(() => {
    if (!nodeId()) {
      store.onError.get()?.('010', errorMessages['error010']());
    }
  });

  const onConnectExtended = (params: Connection) => {
    const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store;

    const edgeParams = {
      ...defaultEdgeOptions,
      ...params,
    };
    if (hasDefaultEdges.get()) {
      const { edges, setEdges } = store;
      setEdges(addEdge(edgeParams, edges.get()));
    }

    onConnectAction.get()?.(edgeParams);
    p.onConnect?.(edgeParams);
  };

  const onPointerDown = (event: MouseEvent | TouchEvent) => {
    const currentNodeId = nodeId();

    if (!currentNodeId) {
      return;
    }

    const isMouseTriggered = isMouseEvent(event);

    if (p.isConnectableStart && ((isMouseTriggered && (event as MouseEvent).button === 0) || !isMouseTriggered)) {
      const currentStore = store;

      XYHandle.onPointerDown(event, {
        autoPanOnConnect: currentStore.autoPanOnConnect.get(),
        connectionMode: currentStore.connectionMode.get(),
        connectionRadius: currentStore.connectionRadius.get(),
        domNode: currentStore.domNode.get(),
        nodeLookup: currentStore.nodeLookup,
        lib: currentStore.lib.get(),
        isTarget: isTarget(),
        handleId: handleId(),
        nodeId: currentNodeId,
        flowId: currentStore.rfId.get(),
        panBy: currentStore.panBy,
        cancelConnection: currentStore.cancelConnection,
        onConnectStart: currentStore.onConnectStart,
        onConnectEnd: currentStore.onConnectEnd,
        updateConnection: currentStore.updateConnection,
        onConnect: onConnectExtended,
        isValidConnection: p.isValidConnection || currentStore.isValidConnection,
        getTransform: () => store.transform.get(),
        getFromHandle: () => store.connection.get().fromHandle,
        autoPanSpeed: currentStore.autoPanSpeed.get(),
      });
    }

    // Handle SolidJS event callbacks
    if (isMouseTriggered && p.onMouseDown) {
      (p.onMouseDown as any)(event);
    } else if (!isMouseTriggered && p.onTouchStart) {
      (p.onTouchStart as any)(event);
    }
  };

  const onClick = (event: MouseEvent) => {
    const currentNodeId = nodeId();

    const {
      onClickConnectStart,
      onClickConnectEnd,
      connectionClickStartHandle: getConnectionClickStartHandle,
      connectionMode,
      isValidConnection: isValidConnectionStore,
      lib,
      rfId: flowId,
      nodeLookup,
      connection: connectionState,
    } = store;

    const connectionClickStartHandle = getConnectionClickStartHandle.get();

    if (!currentNodeId || (!connectionClickStartHandle && !p.isConnectableStart)) {
      return;
    }

    if (!connectionClickStartHandle) {
      onClickConnectStart?.(event, { nodeId: currentNodeId, handleId: handleId(), handleType: p.type });
      store.connectionClickStartHandle.set({ nodeId: currentNodeId, type: p.type, id: handleId() });
      return;
    }

    const doc = getHostForElement(event.target as HTMLElement);
    const { connection, isValid } = XYHandle.isValid(event, {
      handle: {
        nodeId: currentNodeId,
        id: handleId(),
        type: p.type,
      },
      connectionMode: connectionMode.get(),
      fromNodeId: connectionClickStartHandle.nodeId,
      fromHandleId: connectionClickStartHandle.id || null,
      fromType: connectionClickStartHandle.type,
      isValidConnection: p.isValidConnection || isValidConnectionStore,
      flowId: flowId.get(),
      doc,
      lib: lib.get(),
      nodeLookup,
    });

    if (isValid && connection) {
      onConnectExtended(connection);
    }

    const connectionClone = structuredClone(connectionState.get()) as Optional<ConnectionState, 'inProgress'>;
    delete connectionClone.inProgress;
    connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
    onClickConnectEnd?.(event as unknown as MouseEvent, connectionClone);

    store.connectionClickStartHandle.set(null);
  };

  return (
    <div
      data-handleid={handleId()}
      data-nodeid={nodeId()}
      data-handlepos={p.position}
      data-id={`${storeData.rfId()}-${nodeId()}-${handleId()}-${p.type}`}
      class={cc([
        'react-flow__handle',
        `react-flow__handle-${p.position}`,
        'nodrag',
        storeData.noPanClassName(),
        p.class,
        {
          source: !isTarget(),
          target: isTarget(),
          connectable: p.isConnectable,
          connectablestart: p.isConnectableStart,
          connectableend: p.isConnectableEnd,
          clickconnecting: connectingData.clickConnecting(),
          connectingfrom: connectingData.connectingFrom(),
          connectingto: connectingData.connectingTo(),
          valid: connectingData.valid(),
          /*
           * shows where you can start a connection from
           * and where you can end it while connecting
           */
          connectionindicator:
            p.isConnectable &&
            (!connectingData.connectionInProcess() || connectingData.isPossibleEndHandle()) &&
            (connectingData.connectionInProcess() || connectingData.clickConnectionInProcess()
              ? p.isConnectableEnd
              : p.isConnectableStart),
        },
      ])}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      onClick={storeData.connectOnClick() ? onClick : undefined}
      ref={p.ref}
      {...rest}
    >
      {p.children}
    </div>
  );
}

/**
 * The `<Handle />` component is used in your [custom nodes](/learn/customization/custom-nodes)
 * to define connection points.
 *
 *@public
 *
 *@example
 *
 *```jsx
 *import { Handle, Position } from '@xyflow/solid';
 *
 *export function CustomNode({ data }) {
 *  return (
 *    <>
 *      <div style={{ padding: '10px 20px' }}>
 *        {data.label}
 *      </div>
 *
 *      <Handle type="target" position={Position.Left} />
 *      <Handle type="source" position={Position.Right} />
 *    </>
 *  );
 *};
 *```
 */
export const Handle = HandleComponent;

// type Event =
