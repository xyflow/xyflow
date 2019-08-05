import React, { memo, useContext } from 'react';

import BaseHandle from './BaseHandle';
import { ConnectionContext } from '../../ConnectionContext';
import NodeIdContext from '../NodeIdContext'

const TargetHandle = memo((props) => {
  const nodeId = useContext(NodeIdContext);
  const { setPosition, setSourceId, onConnect } = useContext(ConnectionContext);

  return (
    <BaseHandle
      target
      nodeId={nodeId}
      setPosition={setPosition}
      setSourceId={setSourceId}
      onConnect={onConnect}
      {...props}
    />
  );
});

TargetHandle.displayName = 'TargetHandle';
TargetHandle.whyDidYouRender = true;

export default TargetHandle;
