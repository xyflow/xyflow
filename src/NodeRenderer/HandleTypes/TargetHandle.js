import React, { memo, useContext } from 'react';

import BaseHandle from './BaseHandle';
import { GraphContext } from '../../GraphContext';
import NodeIdContext from '../NodeIdContext'

export default memo((props) => {
  const nodeId = useContext(NodeIdContext);
  const { dispatch, onConnect } = useContext(GraphContext);

  return (
    <BaseHandle
      target
      nodeId={nodeId}
      dispatch={dispatch}
      onConnect={onConnect}
      {...props}
    />
  );
});

