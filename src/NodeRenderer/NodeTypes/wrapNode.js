import React, { useEffect, useRef, useContext, useState } from 'react';
import ReactDraggable from 'react-draggable';
import cx from 'classnames';

import { GraphContext } from '../../GraphContext';
import { updateNodeData, updateNodePos, setSelectedElements } from '../../state/actions';
import { isEdge } from '../../graph-utils';

const isInputTarget = (e) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);

export default NodeComponent => (props) => {
  const nodeElement = useRef(null);
  const { state, dispatch } = useContext(GraphContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const { data, onClick, __rg } = props;
  const { position } = __rg;
  const { id } = data;
  const [ x, y, k ] = state.transform;
  const selected = state.selectedElements.filter(e => !isEdge(e)).map(e => e.data.id).includes(id);
  const nodeClasses = cx('react-graph__node', { selected });

  useEffect(() => {
    const bounds = nodeElement.current.getBoundingClientRect();
    const unscaledWith = Math.round(bounds.width * (1 / k));
    const unscaledHeight = Math.round(bounds.height * (1 / k));

    dispatch(updateNodeData(id, { width: unscaledWith, height: unscaledHeight }));
  }, []);

  const onStart = (evt) => {
    if (isInputTarget(evt)) {
      return false;
    }

    const scaledClientX = {
      x: evt.clientX * (1 / k),
      y: evt.clientY * (1 / k)
    }
    const offsetX = scaledClientX.x - position.x - x;
    const offsetY = scaledClientX.y - position.y - y;

    setOffset({ x: offsetX, y: offsetY });
  };

  const onDrag = (evt) => {
    const scaledClientX = {
      x: evt.clientX * (1 / k),
      y: evt.clientY * (1 / k)
    };

    dispatch(updateNodePos(id, {
      x: scaledClientX.x - x - offset.x,
      y: scaledClientX.y - y - offset.y
    }));
  };

  const onNodeClick = (evt) => {
    if (isInputTarget(evt)) {
      return false;
    }

    dispatch(setSelectedElements({ data }));
    onClick({ data, position });
  };

  return (
    <ReactDraggable.DraggableCore
      grid={[1, 1]}
      onStart={onStart}
      onDrag={onDrag}
      scale={k}
    >
      <div
        className={nodeClasses}
        ref={nodeElement}
        style={{ zIndex: selected ? 10 : 3, transform: `translate(${position.x}px,${position.y}px)` }}
        onClick={onNodeClick}
      >
        <NodeComponent {...props} />
      </div>
    </ReactDraggable.DraggableCore>
  );
};
