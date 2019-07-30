import React, { useEffect, useRef, useContext, useState, memo } from 'react';
import ReactDraggable from 'react-draggable';
import cx from 'classnames';

import { GraphContext } from '../../GraphContext';
import { updateNodeData, updateNodePos, setSelectedElements } from '../../state/actions';
import { isNode } from '../../graph-utils';
import { Provider } from '../NodeIdContext';

const isInput = e => ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.nodeName);
const isHandle = e => e.target.className && e.target.className.includes('source');

const getHandleBounds = (sel, nodeElement, parentBounds) => {
  const handle = nodeElement.querySelector(sel);

  if (!handle) {
    return null;
  }

  const bounds = handle.getBoundingClientRect();
  return {
    x: bounds.x - parentBounds.x,
    y: bounds.y - parentBounds.y,
    width: bounds.width,
    height: bounds.height
  };
};

const onDragOver = evt => {
  evt.preventDefault();

  evt.dataTransfer.dropEffect = "move";
}

export default NodeComponent => memo((props) => {
  const nodeElement = useRef(null);
  const { state, dispatch } = useContext(GraphContext);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const {
    data, onClick, type, id, __rg, onConnect, onNodeDragStop
  } = props;
  const { position } = __rg;
  const [ x, y, k ] = state.transform;
  const selected = state.selectedElements.filter(isNode).map(e => e.id).includes(id);
  const nodeClasses = cx('react-graph__node', { selected });

  useEffect(() => {
    const bounds = nodeElement.current.getBoundingClientRect();
    const unscaledWith = Math.round(bounds.width * (1 / k));
    const unscaledHeight = Math.round(bounds.height * (1 / k));
    const handleBounds = {
      source: getHandleBounds('.source', nodeElement.current, bounds),
      target: getHandleBounds('.target', nodeElement.current, bounds)
    };

    dispatch(updateNodeData(id, { width: unscaledWith, height: unscaledHeight, handleBounds }));
  }, []);

  const onStart = (evt) => {
    if (isInput(evt) || isHandle(evt)) {
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
    if (isInput(evt)) {
      return false;
    }

    dispatch(setSelectedElements({ data, id }));
    onClick({ id, type, data, position });
  };

  const onStop = () => {
    onNodeDragStop({
      id,
      type,
      data,
      position
    });
  }

  const onDrop = (evt) => {
    evt.preventDefault();

    const source = evt.dataTransfer.getData('text/plain');

    if (source === id) {
      console.warn('You can\'t connect a node with itself.');
      return false;
    }

    onConnect({ source, target: id });
  };

  return (
    <ReactDraggable.DraggableCore
      grid={[1, 1]}
      onStart={onStart}
      onDrag={onDrag}
      onStop={onStop}
      scale={k}
    >
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className={nodeClasses}
        ref={nodeElement}
        style={{ zIndex: selected ? 10 : 3, transform: `translate(${position.x}px,${position.y}px)` }}
        onClick={onNodeClick}
      >
        <Provider value={id}>
          <NodeComponent {...props} selected={selected} />
        </Provider>
      </div>
    </ReactDraggable.DraggableCore>
  );
});
