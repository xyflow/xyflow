import React, { memo, useContext } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import BaseHandle from './BaseHandle';
import NodeIdContext from '../NodeIdContext'

const SourceHandle = memo((props) => {
  const nodeId = useContext(NodeIdContext);
  const { setPosition, setSourceId } = useStoreActions(a => ({
    setPosition: a.setConnectionPosition,
    setSourceId: a.setConnectionSourceId
  }));
  const onConnect = useStoreState(s => s.onConnect);

  return (
    <BaseHandle
      type="source"
      position="bottom"
      nodeId={nodeId}
      setPosition={setPosition}
      setSourceId={setSourceId}
      onConnect={onConnect}
      {...props}
    />
  );
});

SourceHandle.displayName = 'SourceHandle';

export default SourceHandle;
