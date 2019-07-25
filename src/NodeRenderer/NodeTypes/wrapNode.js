import React, { useEffect, useRef, useContext, useState, memo } from 'react';
import ReactDraggable from 'react-draggable';
import cx from 'classnames';

import { GraphContext } from '../../GraphContext';
import { updateNodeData, updateNodePos, setSelectedElements } from '../../state/actions';
import { isNode } from '../../graph-utils';

const isInputTarget = (e) => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);

export default NodeComponent => memo((props) => {
  const nodeElement = useRef(null);
  const { state, dispatch } = useContext(GraphContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const { data, onClick, type, id, __rg } = props;
  const { position } = __rg;
  const [ x, y, k ] = state.transform;
  const selected = state.selectedElements.filter(isNode).map(e => e.id).includes(id);
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

    const scaledClient = {
      x: evt.clientX * (1 / k),
      y: evt.clientY * (1 / k)
    }
    const offsetX = scaledClient.x - position.x - x;
    const offsetY = scaledClient.y - position.y - y;

    setOffset({ x: offsetX, y: offsetY });
  };

  const onDrag = (evt) => {
    const scaledClient = {
      x: evt.clientX * (1 / k),
      y: evt.clientY * (1 / k)
    };

    dispatch(updateNodePos(id, {
      x: scaledClient.x - x - offset.x,
      y: scaledClient.y - y - offset.y
    }));
  };

  const onNodeClick = (evt) => {
    if (isInputTarget(evt)) {
      return false;
    }

    dispatch(setSelectedElements({ data, id }));
    onClick({ id, type, data, position });
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
        <NodeComponent {...props} selected={selected} />
      </div>
    </ReactDraggable.DraggableCore>
  );
});
