import { memo, HTMLAttributes, forwardRef, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { errorMessages, Position, type HandleProps, type Connection, type HandleType } from '@reactflow/system';
import { getHostForElement, isMouseEvent } from '@reactflow/utils';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { useNodeId } from '../../contexts/NodeIdContext';
import { handlePointerDown } from './handler';
import { addEdge } from '../../utils/';
import { type ReactFlowState } from '../../types';
import { isValidHandle } from './utils';

const alwaysValid = () => true;

export type HandleComponentProps = HandleProps & Omit<HTMLAttributes<HTMLDivElement>, 'id'>;

const selector = (s: ReactFlowState) => ({
  connectionStartHandle: s.connectionStartHandle,
  connectOnClick: s.connectOnClick,
  noPanClassName: s.noPanClassName,
});

const connectingSelector =
  (nodeId: string | null, handleId: string | null, type: HandleType) => (state: ReactFlowState) => {
    const {
      connectionStartHandle: startHandle,
      connectionEndHandle: endHandle,
      connectionClickStartHandle: clickHandle,
    } = state;

    return {
      connecting:
        (startHandle?.nodeId === nodeId && startHandle?.handleId === handleId && startHandle?.type === type) ||
        (endHandle?.nodeId === nodeId && endHandle?.handleId === handleId && endHandle?.type === type),
      clickConnecting:
        clickHandle?.nodeId === nodeId && clickHandle?.handleId === handleId && clickHandle?.type === type,
    };
  };

const Handle = forwardRef<HTMLDivElement, HandleComponentProps>(
  (
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
    },
    ref
  ) => {
    const handleId = id || null;
    const isTarget = type === 'target';
    const store = useStoreApi();
    const nodeId = useNodeId();
    const { connectOnClick, noPanClassName } = useStore(selector, shallow);
    const { connecting, clickConnecting } = useStore(connectingSelector(nodeId, handleId, type), shallow);

    if (!nodeId) {
      store.getState().onError?.('010', errorMessages['error010']());
    }

    const onConnectExtended = (params: Connection) => {
      const { defaultEdgeOptions, onConnect: onConnectAction, hasDefaultEdges } = store.getState();

      const edgeParams = {
        ...defaultEdgeOptions,
        ...params,
      };
      if (hasDefaultEdges) {
        const { edges, setEdges } = store.getState();
        setEdges(addEdge(edgeParams, edges));
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
        handlePointerDown({
          event,
          handleId,
          nodeId,
          onConnect: onConnectExtended,
          isTarget,
          getState: store.getState,
          setState: store.setState,
          isValidConnection: isValidConnection || store.getState().isValidConnection || alwaysValid,
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
      } = store.getState();

      if (!nodeId || (!connectionClickStartHandle && !isConnectableStart)) {
        return;
      }

      if (!connectionClickStartHandle) {
        onClickConnectStart?.(event, { nodeId, handleId, handleType: type });
        store.setState({ connectionClickStartHandle: { nodeId, type, handleId } });
        return;
      }

      const doc = getHostForElement(event.target as HTMLElement);
      const isValidConnectionHandler = isValidConnection || isValidConnectionStore || alwaysValid;
      const { connection, isValid } = isValidHandle(
        event.nativeEvent,
        {
          nodeId,
          id: handleId,
          type,
        },
        connectionMode,
        connectionClickStartHandle.nodeId,
        connectionClickStartHandle.handleId || null,
        connectionClickStartHandle.type,
        isValidConnectionHandler,
        doc
      );

      if (isValid) {
        onConnectExtended(connection);
      }

      onClickConnectEnd?.(event as unknown as MouseEvent);

      store.setState({ connectionClickStartHandle: null });
    };

    return (
      <div
        data-handleid={handleId}
        data-nodeid={nodeId}
        data-handlepos={position}
        data-id={`${nodeId}-${handleId}-${type}`}
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
            connecting: clickConnecting,
            // this class is used to style the handle when the user is connecting
            connectionindicator:
              isConnectable && ((isConnectableStart && !connecting) || (isConnectableEnd && connecting)),
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
);

Handle.displayName = 'Handle';

export default memo(Handle);
