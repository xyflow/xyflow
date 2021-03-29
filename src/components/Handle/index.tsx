import React, { memo, useContext, useCallback, FC, HTMLAttributes } from 'react';
import cc from 'classcat';

import { useStoreActions, useStoreState } from '../../store/hooks';
import NodeIdContext from '../../contexts/NodeIdContext';
import { HandleProps, Connection, ElementId, Position } from '../../types';

import { onMouseDown, SetSourceIdFunc, SetPosition } from './handler';

const alwaysValid = () => true;

const Handle: FC<HandleProps & Omit<HTMLAttributes<HTMLDivElement>, 'id'>> = ({
  type = 'source',
  position = Position.Top,
  isValidConnection = alwaysValid,
  isConnectable = true,
  id,
  onConnect,
  children,
  className,
  ...rest
}) => {
  const nodeId = useContext(NodeIdContext) as ElementId;
  const setPosition = useStoreActions((actions) => actions.setConnectionPosition);
  const setConnectionNodeId = useStoreActions((actions) => actions.setConnectionNodeId);
  const onConnectAction = useStoreState((state) => state.onConnect);
  const onConnectStart = useStoreState((state) => state.onConnectStart);
  const onConnectStop = useStoreState((state) => state.onConnectStop);
  const onConnectEnd = useStoreState((state) => state.onConnectEnd);
  const connectionMode = useStoreState((state) => state.connectionMode);
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
        (setConnectionNodeId as unknown) as SetSourceIdFunc,
        (setPosition as unknown) as SetPosition,
        onConnectExtended,
        isTarget,
        isValidConnection,
        connectionMode,
        onConnectStart,
        onConnectStop,
        onConnectEnd
      );
    },
    [
      handleId,
      nodeId,
      setConnectionNodeId,
      setPosition,
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
      {...rest}
    >
      {children}
    </div>
  );
};

Handle.displayName = 'Handle';

export default memo(Handle);
