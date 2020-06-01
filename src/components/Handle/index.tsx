import React, { memo, useContext } from 'react';

import { useStoreActions, useStoreState } from '../../store/hooks';
import BaseHandle from './BaseHandle';
import NodeIdContext from '../../contexts/NodeIdContext';

import { HandleProps, ElementId, Position, Connection } from '../../types';

const Handle = memo(
  ({
    type = 'source',
    position = Position.Top,
    onConnect = () => {},
    isValidConnection = () => true,
    style,
    className,
    id,
  }: HandleProps) => {
    const nodeId = useContext(NodeIdContext) as ElementId;
    const setPosition = useStoreActions((a) => a.setConnectionPosition);
    const setConnectionNodeId = useStoreActions((a) => a.setConnectionNodeId);
    const onConnectAction = useStoreState((s) => s.onConnect);
    const onConnectExtended = (params: Connection) => {
      onConnectAction(params);
      onConnect(params);
    };

    return (
      <BaseHandle
        nodeId={nodeId}
        setPosition={setPosition}
        setConnectionNodeId={setConnectionNodeId}
        onConnect={onConnectExtended}
        type={type}
        position={position}
        isValidConnection={isValidConnection}
        style={style}
        className={className}
        id={id}
      />
    );
  }
);

Handle.displayName = 'Handle';

export default Handle;
