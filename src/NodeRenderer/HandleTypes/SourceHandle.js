import React, { memo, useContext } from 'react';

import BaseHandle from './BaseHandle';
import NodeIdContext from '../NodeIdContext'
import { GraphContext } from '../../GraphContext';

export default memo((props) => {
  const nodeId = useContext(NodeIdContext);
  const { dispatch, onConnect } = useContext(GraphContext);

  return (
    <BaseHandle
      source
      nodeId={nodeId}
      dispatch={dispatch}
      onConnect={onConnect}
      {...props}
    />
  );
});
