import React, { memo, useContext } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import BaseHandle from './BaseHandle';
import NodeIdContext from '../NodeIdContext'

const TargetHandle = memo((props) => {
  const nodeId = useContext(NodeIdContext);
  const { setPosition, setSourceId } = useStoreActions(a => ({
    setPosition: a.setConnectionPosition,
    setSourceId: a.setConnectionSourceId
  }));
  const onConnect = useStoreState(s => s.onConnect);

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
TargetHandle.whyDidYouRender = false;

export default TargetHandle;
