import React, { useContext } from 'react';
import ReactDraggable from 'react-draggable';
import cx from 'classnames';

import { GraphContext } from '../../GraphContext';
import { updateNodePos, setSelectedNodesIds } from '../../state/actions';

const isInputTarget = (e) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);

export default EdgeComponent => (props) => {
  const { state, dispatch } = useContext(GraphContext);
  const { data, onClick } = props;
  const { id } = data;
  const [ x, y, k ] = state.transform;
  const selected = state.selectedNodeIds.includes(id);
  const edgeClasses = cx('react-graph__edge', { selected });

  return (
    <g
      className={edgeClasses}
      onClick={(e) => {
        if (isInputTarget(e)) {
          return false;
        }

        // dispatch(setSelectedNodesIds(id));
        onClick({ data });
      }}
    >
      <EdgeComponent {...props} />
    </g>
  );
};
