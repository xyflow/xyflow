import {
  type HTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type TouchEvent as ReactTouchEvent,
  type ForwardedRef,
  memo,
  useRef,
} from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import {
  errorMessages,
  Position,
  XYHandle,
  getHostForElement,
  isMouseEvent,
  type HandleProps as HandlePropsSystem,
  type Connection,
  type HandleType,
  ConnectionMode,
  OnConnect,
  ConnectionState,
  FinalConnectionState,
  Optional,
} from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import { useHandleConfig } from '../../contexts/HandleConfigContext';
import { type ReactFlowState } from '../../types';
import { fixedForwardRef } from '../../utils';
import { addEdge } from '../../utils/edges';

/**
 * @expand
 */
export type HandleProps = HandlePropsSystem &
  Omit<HTMLAttributes<HTMLDivElement>, 'id'> & {
    /** Callback called when connection is made */
    onConnect?: OnConnect;
  };

const selector = (s: ReactFlowState) => ({
  connectOnClick: s.connectOnClick,
  noPanClassName: s.noPanClassName,
  rfId: s.rfId,
});

/*
 * While no connection is in progress every handle has this same state, so we return a
 * shared reference rather than allocating + shallow-comparing one per handle on every
 * store update. `isPossibleEndHandle` matches what the selector computes when idle.
 */
const idleConnectingState = {
  connectingFrom: false,
  connectingTo: false,
  clickConnecting: false,
  isPossibleEndHandle: true,
  connectionInProcess: false,
  clickConnectionInProcess: false,
  valid: false,
};

const connectingSelector =
  (nodeId: string | null, handleId: string | null, type: HandleType) => (state: ReactFlowState) => {
    const { connectionClickStartHandle: clickHandle, connectionMode, connection } = state;
    const { fromHandle, toHandle, isValid } = connection;

    if (!fromHandle && !clickHandle) {
      return idleConnectingState;
    }

    const connectingTo = toHandle?.nodeId === nodeId && toHandle?.id === handleId && toHandle?.type === type;

    return {
      connectingFrom: fromHandle?.nodeId === nodeId && fromHandle?.id === handleId && fromHandle?.type === type,
      connectingTo,
      clickConnecting: clickHandle?.nodeId === nodeId && clickHandle?.id === handleId && clickHandle?.type === type,
      isPossibleEndHandle:
        connectionMode === ConnectionMode.Strict
          ? fromHandle?.type !== type
          : nodeId !== fromHandle?.nodeId || handleId !== fromHandle?.id,
      connectionInProcess: !!fromHandle,
      clickConnectionInProcess: !!clickHandle,
      valid: connectingTo && isValid,
    };
  };

function HandleComponent(
  {
    type = 'source',
    position = Position.Top,
    isValidConnection,
    isConnectable = true,
    isConnectableStart = true,
    isConnectableEnd = true,
    id,
    onConnect,
    children,
    className,
    onMouseDown,
    onTouchStart,
    ...rest
  }: HandleProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  const handleId = id || null;
  const isTarget = type === 'target';
  const store = useStoreApi();
  const nodeId = useNodeId();
  const { connectOnClick, noPanClassName, rfId } = useHandleConfig();
  const {
    connectingFrom,
    connectingTo,
    clickConnecting,
    isPossibleEndHandle,
    connectionInProcess,
    clickConnectionInProcess,
    valid,
  } = useStore(connectingSelector(nodeId, handleId, type), shallow);
  if (!nodeId) {
    store.getState().onError?.('010', errorMessages['error010']());
  }

  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  const onConnectExtended = (params: Connection) => {
    const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();

    const edgeParams = {
      ...defaultEdgeOptions,
      ...params,
    };
    if (hasDefaultEdges) {
      const { edges, setEdges, onError } = store.getState();
      setEdges(addEdge(edgeParams, edges, { onError }));
    }

    onConnectAction?.(edgeParams);
    onConnect?.(edgeParams);
  };
  const onPointerDown = (event: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>) => {
    if (!nodeId) {
      return;
    }

    const isMouseTriggered = isMouseEvent(event.nativeEvent);

    if (
      isConnectableStart &&
      ((isMouseTriggered && (event as ReactMouseEvent<HTMLDivElement>).button === 0) || !isMouseTriggered)
    ) {
      const currentStore = store.getState();

      pointerDownPos.current = isMouseTriggered
        ? {
            x: (event as ReactMouseEvent<HTMLDivElement>).clientX,
            y: (event as ReactMouseEvent<HTMLDivElement>).clientY,
          }
        : {
            x: (event as ReactTouchEvent<HTMLDivElement>).touches[0].clientX,
            y: (event as ReactTouchEvent<HTMLDivElement>).touches[0].clientY,
          };

      XYHandle.onPointerDown(event.nativeEvent, {
        handleDomNode: event.currentTarget,
        autoPanOnConnect: currentStore.autoPanOnConnect,
        connectionMode: currentStore.connectionMode,
        connectionRadius: currentStore.connectionRadius,
        domNode: currentStore.domNode,
        nodeLookup: currentStore.nodeLookup,
        lib: currentStore.lib,
        isTarget,
        handleId,
        nodeId,
        flowId: currentStore.rfId,
        panBy: currentStore.panBy,
        cancelConnection: currentStore.cancelConnection,
        onConnectStart: currentStore.onConnectStart,
        onConnectEnd: (...args) => store.getState().onConnectEnd?.(...args),
        updateConnection: currentStore.updateConnection,
        onConnect: onConnectExtended,
        isValidConnection: isValidConnection || ((...args) => store.getState().isValidConnection?.(...args) ?? true),
        getTransform: () => store.getState().transform,
        getFromHandle: () => store.getState().connection.fromHandle,
        autoPanSpeed: currentStore.autoPanSpeed,
        dragThreshold: currentStore.connectionDragThreshold,
      });
    }

    if (isMouseTriggered) {
      onMouseDown?.(event as ReactMouseEvent<HTMLDivElement>);
    } else {
      onTouchStart?.(event as ReactTouchEvent<HTMLDivElement>);
    }
  };

  const onClick = (event: ReactMouseEvent) => {
    const {
      onClickConnectStart,
      onClickConnectEnd,
      connectionClickStartHandle,
      connectionMode,
      isValidConnection: isValidConnectionStore,
      lib,
      rfId: flowId,
      nodeLookup,
      connection: connectionState,
      connectionDragThreshold,
    } = store.getState();

    if (pointerDownPos.current) {
      const dx = event.clientX - pointerDownPos.current.x;
      const dy = event.clientY - pointerDownPos.current.y;
      pointerDownPos.current = null;
      if (dx * dx + dy * dy > connectionDragThreshold * connectionDragThreshold) {
        return;
      }
    }

    if (!nodeId || (!connectionClickStartHandle && !isConnectableStart)) {
      return;
    }

    if (!connectionClickStartHandle) {
      onClickConnectStart?.(event.nativeEvent, { nodeId, handleId, handleType: type });
      store.setState({ connectionClickStartHandle: { nodeId, type, id: handleId } });
      return;
    }

    const doc = getHostForElement(event.target);
    const isValidConnectionHandler = isValidConnection || isValidConnectionStore;
    const { connection, isValid } = XYHandle.isValid(event.nativeEvent, {
      handle: {
        nodeId,
        id: handleId,
        type,
      },
      connectionMode,
      fromNodeId: connectionClickStartHandle.nodeId,
      fromHandleId: connectionClickStartHandle.id || null,
      fromType: connectionClickStartHandle.type,
      isValidConnection: isValidConnectionHandler,
      flowId,
      doc,
      lib,
      nodeLookup,
    });

    if (isValid && connection) {
      onConnectExtended(connection);
    }

    const connectionClone = structuredClone(connectionState) as Optional<ConnectionState, 'inProgress'>;
    delete connectionClone.inProgress;
    connectionClone.toPosition = connectionClone.toHandle ? connectionClone.toHandle.position : null;
    onClickConnectEnd?.(event as unknown as MouseEvent, connectionClone as FinalConnectionState);

    store.setState({ connectionClickStartHandle: null });
  };

  return (
    <div
      data-handleid={handleId}
      data-nodeid={nodeId}
      data-handlepos={position}
      data-id={`${rfId}-${nodeId}-${handleId}-${type}`}
      className={cc([
        'react-flow__handle',
        `react-flow__handle-${position}`,
        'nodrag',
        noPanClassName,
        className,
        {
          source: !isTarget,
          target: isTarget,
          connectable: isConnectable,
          connectablestart: isConnectableStart,
          connectableend: isConnectableEnd,
          clickconnecting: clickConnecting,
          connectingfrom: connectingFrom,
          connectingto: connectingTo,
          valid,
          /*
           * shows where you can start a connection from
           * and where you can end it while connecting
           */
          connectionindicator:
            isConnectable &&
            (!connectionInProcess || isPossibleEndHandle) &&
            (connectionInProcess || clickConnectionInProcess
              ? isConnectableEnd || clickConnecting
              : isConnectableStart),
        },
      ])}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      onClick={connectOnClick ? onClick : undefined}
      ref={ref}
      {...rest}
    >
      {children}
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
 *import { Handle, Position } from '@xyflow/react';
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
export const Handle = memo(fixedForwardRef(HandleComponent));
