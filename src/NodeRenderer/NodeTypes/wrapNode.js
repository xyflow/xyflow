import React, { useEffect, useRef, useState, memo } from 'react';
import ReactDraggable from 'react-draggable';
import cx from 'classnames';

import { updateNodeData, updateNodePos, setSelectedElements } from '../../state/actions';
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

const onStart = (evt, { dispatch, setOffset, onClick, id, type, data, position, transform }) => {
  if (isInput(evt) || isHandle(evt)) {
    return false;
  }

  const scaledClient = {
    x: evt.clientX * (1 / [transform[2]]),
    y: evt.clientY * (1 / [transform[2]])
  }
  const offsetX = scaledClient.x - position.x - [transform[0]];
  const offsetY = scaledClient.y - position.y - [transform[1]];
  const node = { id, type, position, data }

  dispatch(setSelectedElements({ id, type }));
  setOffset({ x: offsetX, y: offsetY });
  onClick(node);
};

const onDrag = (evt, { dispatch, setDragging, id, offset, transform }) => {
  const scaledClient = {
    x: evt.clientX * (1 / [transform[2]]),
    y: evt.clientY * (1 / [transform[2]])
  };

  setDragging(true);
  dispatch(updateNodePos(id, {
    x: scaledClient.x - [transform[0]] - offset.x,
    y: scaledClient.y - [transform[1]] - offset.y
  }));
};

const onStop = ({ onNodeDragStop, setDragging, isDragging, id, type, position, data }) => {
  if (!isDragging) {
    return false;
  }

  setDragging(false);
  onNodeDragStop({
    id, type, position, data
  });
};

export default NodeComponent => {
  const WrappedComp = memo((props) => {
    const nodeElement = useRef(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setDragging] = useState(false);
    const {
      id, type, data, transform, xPos, yPos, selected,
      dispatch, onClick, onNodeDragStop, style
    } = props;

    const position = { x: xPos, y: yPos };
    const nodeClasses = cx('react-graph__node', { selected });
    const nodeStyle = { zIndex: selected ? 10 : 3, transform: `translate(${xPos}px,${yPos}px)` };

    useEffect(() => {
      const bounds = nodeElement.current.getBoundingClientRect();
      const unscaledWith = Math.round(bounds.width * (1 / transform[2]));
      const unscaledHeight = Math.round(bounds.height * (1 / transform[2]));
      const handleBounds = {
        source: getHandleBounds('.source', nodeElement.current, bounds, transform[2]),
        target: getHandleBounds('.target', nodeElement.current, bounds, transform[2])
      };

      dispatch(updateNodeData(id, { width: unscaledWith, height: unscaledHeight, handleBounds }));
    }, []);

    return (
      <ReactDraggable.DraggableCore
        onStart={evt => onStart(evt, { dispatch, onClick, id, type, data, setOffset, transform, position })}
        onDrag={evt => onDrag(evt, { dispatch, setDragging, id, offset, transform })}
        onStop={() => onStop({ onNodeDragStop, isDragging, setDragging, id, type, position, data })}
        scale={transform[2]}
      >
        <div
          className={nodeClasses}
          ref={nodeElement}
          style={nodeStyle}
        >
          <Provider value={id}>
            <NodeComponent
              id={id}
              data={data}
              type={type}
              style={style}
              selected={selected}
            />
          </Provider>
        </div>
      </ReactDraggable.DraggableCore>
    );
  });

  WrappedComp.displayName = 'Wrapped Node';
  WrappedComp.whyDidYouRender = false;

  return WrappedComp;
};
