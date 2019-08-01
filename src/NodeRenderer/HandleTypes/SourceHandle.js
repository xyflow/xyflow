import React, { memo, useContext } from 'react';

import BaseHandle from './BaseHandle';
import NodeIdContext from '../NodeIdContext'
import { ConnectionContext } from '../../ConnectionContext';

export default memo((props) => {
  const nodeId = useContext(NodeIdContext);
  const { setPosition, setSourceId, onConnect } = useContext(ConnectionContext);

  return (
    <BaseHandle
      source
      nodeId={nodeId}
      setPosition={setPosition}
      setSourceId={setSourceId}
      onConnect={onConnect}
      {...props}
    />
  );
});
