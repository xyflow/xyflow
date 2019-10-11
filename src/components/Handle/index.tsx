import React, { memo, useContext } from 'react';

import { useStoreActions, useStoreState } from '../../store/hooks';
import BaseHandle from './BaseHandle';
import NodeIdContext from '../../contexts/NodeIdContext'

import { HandleType, ElementId, Position } from '../../types';

interface HandleProps {
  type: HandleType,
  position: Position,
  onConnect: (any) => void,
  isValidConnection: () => boolean
};

const Handle = memo(({
  onConnect = () => {}, type = 'source', position = 'top', isValidConnection = () => true,
  ...rest
}: HandleProps) => {
  const nodeId: ElementId = useContext(NodeIdContext);
  const { setPosition, setSourceId } = useStoreActions(a => ({
    setPosition: a.setConnectionPosition,
    setSourceId: a.setConnectionSourceId
  }));
  const onConnectAction = useStoreState(s => s.onConnect);
  const onConnectExtended = (params) => {
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
