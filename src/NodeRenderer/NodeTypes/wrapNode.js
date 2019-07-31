import React, { useEffect, useRef, useContext, useState, memo } from 'react';
import ReactDraggable from 'react-draggable';
import cx from 'classnames';

import { GraphContext } from '../../GraphContext';
import { updateNodeData, updateNodePos, setSelectedElements } from '../../state/actions';
import { isNode } from '../../graph-utils';
import { Provider } from '../NodeIdContext';

const isInput = e => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);
const isHandle = e => (
  e.target.className &&
  e.target.className.includes &&
  (e.target.className.includes('source') || e.target.className.includes('target'))
);

const getHandleBounds = (sel, nodeElement, parentBounds, k) => {
  const handle = nodeElement.querySelector(sel);

  if (!handle) {
    return null;
  }

  const bounds = handle.getBoundingClientRect();
  const unscaledWith = Math.round(bounds.width * (1 / k));
  const unscaledHeight = Math.round(bounds.height * (1 / k));

  return {
    x: (bounds.x - parentBounds.x) * (1 / k),
    y: (bounds.y - parentBounds.y) * (1 / k),
    width: unscaledWith,
    height: unscaledHeight
  };
};

const onStart = (evt, { setOffset, position, transform }) => {
  if (isInput(evt) || isHandle(evt)) {
    return false;
  }

  const scaledClient = {
    x: evt.clientX * (1 / [transform[2]]),
    y: evt.clientY * (1 / [transform[2]])
  }
  const offsetX = scaledClient.x - position.x - [transform[0]];
  const offsetY = scaledClient.y - position.y - [transform[1]];

  setOffset({ x: offsetX, y: offsetY });
};

const onDrag = (evt, { dispatch, id, offset, transform }) => {
  const scaledClient = {
    x: evt.clientX * (1 / [transform[2]]),
    y: evt.clientY * (1 / [transform[2]])
  };

  dispatch(updateNodePos(id, {
    x: scaledClient.x - [transform[0]] - offset.x,
    y: scaledClient.y - [transform[1]] - offset.y
  }));
};

const onNodeClick = (evt, { onClick, dispatch, data, id, type, position }) => {
  if (isInput(evt)) {
    return false;
  }

  dispatch(setSelectedElements({ data, id }));
  onClick({ id, type, data, position });
};

const onStop = ({ onNodeDragStop, id, type, data, position }) => {
  onNodeDragStop({
    id,
    type,
    data,
    position
  });
};

export default NodeComponent => memo((props) => {
  const nodeElement = useRef(null);
  const { state, dispatch } = useContext(GraphContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const {
    data, onClick, type, id, __rg, onNodeDragStop
  } = props;
  const { position } = __rg;
  const [ x, y, k ] = state.transform;
  const selected = state.selectedElements.filter(isNode).map(e => e.id).includes(id);
  const nodeClasses = cx('react-graph__node', { selected });
  const nodeStyle = { zIndex: selected ? 10 : 3, transform: `translate(${position.x}px,${position.y}px)` };

  useEffect(() => {
    const bounds = nodeElement.current.getBoundingClientRect();
    const unscaledWith = Math.round(bounds.width * (1 / k));
    const unscaledHeight = Math.round(bounds.height * (1 / k));
    const handleBounds = {
      source: getHandleBounds('.source', nodeElement.current, bounds, k),
      target: getHandleBounds('.target', nodeElement.current, bounds, k)
    };

    dispatch(updateNodeData(id, { width: unscaledWith, height: unscaledHeight, handleBounds }));
  }, []);

  return (
    <ReactDraggable.DraggableCore
      onStart={evt => onStart(evt, { setOffset, transform: state.transform, position })}
      onDrag={evt => onDrag(evt, { dispatch, id, offset, transform: state.transform })}
      onStop={() => onStop({ onNodeDragStop, id, type, data, position })}
      scale={state.transform[2]}
    >
      <div
        className={nodeClasses}
        ref={nodeElement}
        style={nodeStyle}
        onClick={evt => onNodeClick(evt, { onClick, dispatch, data, id, type, position })}
      >
        <Provider value={id}>
          <NodeComponent {...props} selected={selected} />
        </Provider>
      </div>
    </ReactDraggable.DraggableCore>
  );
});
