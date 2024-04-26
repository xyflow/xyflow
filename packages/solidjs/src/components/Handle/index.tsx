import cc from 'classcat';
// import { shallow } from 'zustand/shallow';
import {
  errorMessages,
  Position,
  XYHandle,
  getHostForElement,
  isMouseEvent,
  addEdge,
  type HandleProps,
  type Connection,
  type HandleType,
  ConnectionMode,
} from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import { SolidEvent, type SolidFlowState } from '../../types';
import { createEffect, mergeProps, splitProps, JSX } from 'solid-js';

export interface HandleComponentProps extends HandleProps, Omit<JSX.HTMLAttributes<HTMLDivElement>, 'id'> {}

const selector = (s: SolidFlowState) => ({
  connectOnClick: s.connectOnClick,
  noPanClassName: s.noPanClassName,
  rfId: s.rfId,
});

const connectingSelector =
  (nodeId: () => string | null, handleId: () => string | null, type: () => HandleType) => (state: SolidFlowState) =>  {
    const {
      connectionStartHandle: startHandle,
      connectionEndHandle: endHandle,
      connectionClickStartHandle: clickHandle,
      connectionMode,
      connectionStatus,
    } = state;

    const connectingTo = () => endHandle.get()?.nodeId === nodeId() && endHandle.get()?.handleId === handleId() && endHandle.get()?.type === type();

    return {
      connectingFrom:
        () => startHandle.get()?.nodeId === nodeId() && startHandle.get()?.handleId === handleId() && startHandle.get()?.type === type(),
      connectingTo,
      clickConnecting:
        () => clickHandle.get()?.nodeId === nodeId() && clickHandle.get()?.handleId === handleId() && clickHandle.get()?.type === type(),
      isPossibleEndHandle: ()=>
        connectionMode.get() === ConnectionMode.Strict
          ? startHandle.get()?.type !== type()
          : nodeId() !== startHandle.get()?.nodeId || handleId() !== startHandle.get()?.handleId,
      connectionInProcess: () => !!startHandle.get(),
      valid: () => connectingTo() && connectionStatus.get() === 'valid',
    };
  };

function HandleComponent(
  _p: HandleComponentProps
  //   {
  //     type = 'source',
  //     position = Position.Top,
  //     isValidConnection,
  //     isConnectable = true,
  //     isConnectableStart = true,
  //     isConnectableEnd = true,
  //     id,
  //     onConnect,
  //     children,
  //     className,
  //     onMouseDown,
  //     onTouchStart,
  //     ...rest
  //   }: HandleComponentProps,
  //   ref: ForwardedRef<HTMLDivElement>
  // ) {
) {
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
    "class",
    'onMouseDown',
    'onTouchStart',
    'onMouseDown',
    "onTouchStart",

  ]);

  const handleId = () => p.id || null;
  const isTarget = () => p.type === 'target';
  const store = useStoreApi();
  const getNodeId = useNodeId();
  const { connectOnClick, noPanClassName, rfId } = useStore(selector);
  const { connectingFrom, connectingTo, clickConnecting, isPossibleEndHandle, connectionInProcess, valid } = useStore(
    connectingSelector(getNodeId, handleId, () => p.type),
  );

  createEffect(() => {
    if (!getNodeId()) {
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
    const nodeId = getNodeId();

    if (!nodeId) {
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
        nodeId: nodeId,
        flowId: currentStore.rfId.get(),
        panBy: currentStore.panBy,
        cancelConnection: currentStore.cancelConnection,
        onConnectStart: currentStore.onConnectStart,
        onConnectEnd: currentStore.onConnectEnd,
        updateConnection: currentStore.updateConnection,
        onConnect: onConnectExtended,
        isValidConnection: p.isValidConnection || currentStore.isValidConnection,
        getTransform: () => store.transform.get(),
        getConnectionStartHandle: () => store.connectionStartHandle.get(),
      });
    }

    if (isMouseTriggered) {
      if (typeof p.onMouseDown === 'function') { 

      p.onMouseDown?.(event as SolidEvent<HTMLDivElement, MouseEvent>);
      }
    } else {
      if (typeof p.onTouchStart === 'function') {
      p.onTouchStart?.(event as SolidEvent<HTMLDivElement, TouchEvent>);
      }
    }
  };

  const onClick = (event: MouseEvent) => {
    const nodeId = getNodeId();

    const {
      onClickConnectStart,
      onClickConnectEnd,
      connectionClickStartHandle: getConnectionClickStartHandle,
      connectionMode,
      isValidConnection: isValidConnectionStore,
      lib,
      rfId: flowId,
    } = store;

    const connectionClickStartHandle = getConnectionClickStartHandle.get();

    if (!nodeId || (!connectionClickStartHandle && !p.isConnectableStart)) {
      return;
    }

    if (!connectionClickStartHandle) {
      onClickConnectStart?.(event, { nodeId, handleId: handleId(), handleType: p.type });
      store.connectionClickStartHandle.set({ nodeId, type: p.type, handleId: handleId() })
      return;
    }

    const doc = getHostForElement(event.target as HTMLElement);
    const isValidConnectionHandler = p.isValidConnection || isValidConnectionStore;
    const { connection, isValid } = XYHandle.isValid(event, {
      handle: {
        nodeId,
        id: handleId(),
        type: p.type,
      },
      connectionMode: connectionMode.get(),
      fromNodeId: connectionClickStartHandle.nodeId,
      fromHandleId: connectionClickStartHandle.handleId || null,
      fromType: connectionClickStartHandle.type,
      isValidConnection: isValidConnectionHandler,
      flowId: flowId.get(),
      doc,
      lib: lib.get(),
    });

    if (isValid && connection) {
      onConnectExtended(connection);
    }

    onClickConnectEnd?.(event as unknown as MouseEvent);

    store.connectionStartHandle.set(null);
  };

  return (
    <div
      data-handleid={handleId()}
      data-nodeid={getNodeId()}
      data-handlepos={p.position}
      data-id={`${rfId.get()}-${getNodeId()}-${handleId()}-${p.type}`}
      class={cc([
        'react-flow__handle',
        `react-flow__handle-${p.position}`,
        'nodrag',
        noPanClassName.get(),
        p.class,
        {
          source: !isTarget(),
          target: isTarget(),
          connectable: p.isConnectable,
          connectablestart: p.isConnectableStart,
          connectableend: p.isConnectableEnd,
          clickconnecting: clickConnecting(),
          connectingfrom: connectingFrom(),
          connectingto: connectingTo(),
          valid: valid(),
          // shows where you can start a connection from
          // and where you can end it while connecting
          connectionindicator:
            p.isConnectable &&
            (!connectionInProcess() || isPossibleEndHandle()) &&
            (connectionInProcess() ? p.isConnectableEnd : p.isConnectableStart),
        },
      ])}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      onClick={connectOnClick ? onClick : undefined}
      ref={p.ref}
      {...rest}
    >
      {p.children}
    </div>
  );
}

/**
 * The Handle component is a UI element that is used to connect nodes.
 */
export const Handle = HandleComponent;


// type Event = 
