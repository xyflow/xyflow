import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { useStoreActions, useStoreState } from 'easy-peasy';

import BaseHandle from './BaseHandle';
import NodeIdContext from '../../contexts/NodeIdContext'

const Handle = memo(({ onConnect, ...rest }) => {
  const nodeId = useContext(NodeIdContext);
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
      {...rest}
    />
  );
});

Handle.displayName = 'Handle';

Handle.propTypes = {
  type: PropTypes.oneOf(['source', 'target']),
  position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  onConnect: PropTypes.func
};

Handle.defaultProps = {
  type: 'source',
  position: 'top',
  onConnect: () => {}
};

export default Handle;
