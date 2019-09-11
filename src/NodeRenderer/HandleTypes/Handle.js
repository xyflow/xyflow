import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { useStoreActions, useStoreState } from 'easy-peasy';

import BaseHandle from './BaseHandle';
import NodeIdContext from '../NodeIdContext'

const Handle = memo((props) => {
  const nodeId = useContext(NodeIdContext);
  const { setPosition, setSourceId } = useStoreActions(a => ({
    setPosition: a.setConnectionPosition,
    setSourceId: a.setConnectionSourceId
  }));
  const onConnect = useStoreState(s => s.onConnect);

  return (
    <BaseHandle
      nodeId={nodeId}
      setPosition={setPosition}
      setSourceId={setSourceId}
      onConnect={onConnect}
      {...props}
    />
  );
});

Handle.displayName = 'Handle';

Handle.propTypes = {
  type: PropTypes.oneOf(['source', 'target']),
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
};

Handle.defaultProps = {
  type: 'source',
  position: 'top'
};

export default Handle;
