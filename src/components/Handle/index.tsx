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
  const setPosition = useStoreActions((a) => a.setConnectionPosition);
  const setConnectionNodeId = useStoreActions((a) => a.setConnectionNodeId);
  const onConnectAction = useStoreState((s) => s.onConnect);
  const onConnectStart = useStoreState((s) => s.onConnectStart);
  const onConnectStop = useStoreState((s) => s.onConnectStop);
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
      type={type}
      position={position}
      isValidConnection={isValidConnection}
      style={style}
    />
  );
};

Handle.displayName = 'Handle';

export default memo(Handle);
