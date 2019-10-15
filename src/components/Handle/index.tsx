import React, { memo, useContext } from 'react';

import { useStoreActions, useStoreState } from '../../store/hooks';
import BaseHandle from './BaseHandle';
import NodeIdContext from '../../contexts/NodeIdContext'

import { HandleType, ElementId, Position, OnConnectParams, OnConnectFunc } from '../../types';

interface HandleProps {
  type: HandleType,
  position: Position,
  onConnect?: OnConnectFunc,
  isValidConnection?: () => boolean
};

const Handle = memo(({
  onConnect = _ => {}, type = 'source', position = 'top', isValidConnection = () => true,
  ...rest
}: HandleProps) => {
  const nodeId = useContext(NodeIdContext) as ElementId;
  const { setPosition, setSourceId } = useStoreActions(a => ({
    setPosition: a.setConnectionPosition,
    setSourceId: a.setConnectionSourceId
  }));
  const onConnectAction = useStoreState(s => s.onConnect);
  const onConnectExtended = (params: OnConnectParams) => {
    onConnectAction(params);
    onConnect(params);
  };

  return (
    <BaseHandle
      nodeId={nodeId}
      setPosition={setPosition}
      setSourceId={setSourceId}
      onConnect={onConnectExtended}
      type={type}
      position={position}
      isValidConnection={isValidConnection}
      {...rest}
    />
  );
});

Handle.displayName = 'Handle';

export default Handle;
