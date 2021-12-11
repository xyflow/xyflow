import React, { memo, useContext, useCallback, HTMLAttributes, forwardRef } from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import NodeIdContext from '../../contexts/NodeIdContext';
import { HandleProps, Connection, ReactFlowState, Position } from '../../types';
import { onMouseDown } from './handler';

const alwaysValid = () => true;

export type HandleComponentProps = HandleProps & Omit<HTMLAttributes<HTMLDivElement>, 'id'>;

const selector = (s: ReactFlowState) => ({
  onConnectAction: s.onConnect,
  onConnectStart: s.onConnectStart,
  onConnectStop: s.onConnectStop,
  onConnectEnd: s.onConnectEnd,
  connectionMode: s.connectionMode,
});

const Handle = forwardRef<HTMLDivElement, HandleComponentProps>(
  (
    {
      type = 'source',
      position = Position.Top,
      isValidConnection = alwaysValid,
      isConnectable = true,
      id,
      onConnect,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const store = useStoreApi();
    const nodeId = useContext(NodeIdContext) as string;
    const { onConnectAction, onConnectStart, onConnectStop, onConnectEnd, connectionMode } = useStore(
      selector,
      shallow
    );

    const handleId = id || null;
    const isTarget = type === 'target';

    const onConnectExtended = useCallback(
      (params: Connection) => {
        onConnectAction?.(params);
        onConnect?.(params);
      },
      [onConnectAction, onConnect]
    );

    const onMouseDownHandler = useCallback(
      (event: React.MouseEvent) => {
        onMouseDown(
          event,
          handleId,
          nodeId,
          store.setState,
          onConnectExtended,
          isTarget,
          isValidConnection,
          connectionMode,
          undefined,
          undefined,
          onConnectStart,
          onConnectStop,
          onConnectEnd
        );
      },
      [
        handleId,
        nodeId,
        onConnectExtended,
        isTarget,
        isValidConnection,
        connectionMode,
        onConnectStart,
        onConnectStop,
        onConnectEnd,
      ]
    );

    const handleClasses = cc([
      'react-flow__handle',
      `react-flow__handle-${position}`,
      'nodrag',
      className,
      {
        source: !isTarget,
        target: isTarget,
        connectable: isConnectable,
      },
    ]);

    return (
      <div
        data-handleid={handleId}
        data-nodeid={nodeId}
        data-handlepos={position}
        className={handleClasses}
        onMouseDown={onMouseDownHandler}
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
