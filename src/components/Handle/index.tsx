import React, { memo, useContext } from 'react';
import cc from 'classcat';

import { useStoreActions, useStoreState } from '../../store/hooks';
import BaseHandle from './BaseHandle';
import NodeIdContext from '../../contexts/NodeIdContext';

import { HandleProps, ElementId, Position, Connection } from '../../types';

const Handle = ({
  type = 'source',
  position = Position.Top,
  isValidConnection = () => true,
  isConnectable = true,
  style,
  className,
  id,
  onConnect,
}: HandleProps) => {
  const nodeId = useContext(NodeIdContext) as ElementId;
  const setPosition = useStoreActions((actions) => actions.setConnectionPosition);
  const setConnectionNodeId = useStoreActions((actions) => actions.setConnectionNodeId);
  const onConnectAction = useStoreState((state) => state.onConnect);
  const onConnectStart = useStoreState((state) => state.onConnectStart);
  const onConnectStop = useStoreState((state) => state.onConnectStop);
  const onConnectEnd = useStoreState((state) => state.onConnectEnd);

  const onConnectExtended = (params: Connection) => {
    if (onConnectAction) {
      onConnectAction(params);
    }

    if (onConnect) {
      onConnect(params);
    }
  };
  const handleClasses = cc([className, { connectable: isConnectable }]);

  return (
    <BaseHandle
      className={handleClasses}
      id={id}
      nodeId={nodeId}
      setPosition={setPosition}
      setConnectionNodeId={setConnectionNodeId}
      onConnect={onConnectExtended}
      onConnectStart={onConnectStart}
      onConnectStop={onConnectStop}
      onConnectEnd={onConnectEnd}
      type={type}
      position={position}
      isValidConnection={isValidConnection}
      style={style}
    />
  );
};

Handle.displayName = 'Handle';

export default memo(Handle);
