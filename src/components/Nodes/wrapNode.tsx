import React, { useEffect, useRef, useState, memo, ComponentType } from 'react';
import { DraggableCore } from 'react-draggable';
import cx from 'classnames';
import { ResizeObserver } from 'resize-observer';

import { getDimensions, inInputDOMNode } from '../../utils';
import { Provider } from '../../contexts/NodeIdContext';
import store from '../../store';
import { NodeComponentProps } from '../../types';

const isHandle = (e) => (
  e.target.className &&
  e.target.className.includes &&
  (e.target.className.includes('source') || e.target.className.includes('target'))
);

const getHandleBounds = (selector: string, nodeElement: any, parentBounds: any, k: number) => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  return [].map.call(handles, (handle) => {
    const bounds = handle.getBoundingClientRect();
    const dimensions = getDimensions(handle);
    const nodeIdAttr = handle.getAttribute('data-nodeid');
    const handlePosition = handle.getAttribute('data-handlepos');
    const nodeIdSplitted = nodeIdAttr.split('__');

    let handleId = null;

    if (nodeIdSplitted) {
      handleId = nodeIdSplitted.length ? nodeIdSplitted[1] : nodeIdSplitted;
    }

    return {
      id: handleId,
      position: handlePosition,
      x: (bounds.x - parentBounds.x) * (1 / k),
      y: (bounds.y - parentBounds.y) * (1 / k),
      ...dimensions
    };
  });
};

const onStart = (evt, { setOffset, onClick, id, type, data, position, transform }): void => {
  if (!inInputDOMNode(evt) && !isHandle(evt)) {
    const scaledClient = {
      x: evt.clientX * (1 / transform[2]),
      y: evt.clientY * (1 / transform[2])
    };
    const offsetX = scaledClient.x - position.x - transform[0];
    const offsetY = scaledClient.y - position.y - transform[1];
    const node = { id, type, position, data };

    store.dispatch.setSelectedElements({ id, type });
    setOffset({ x: offsetX, y: offsetY });
    onClick(node);
  }
};

const onDrag = (evt, { setDragging, id, offset, transform }): void => {
  const scaledClient = {
    x: evt.clientX * (1 / transform[2]),
    y: evt.clientY * (1 / transform[2])
  };

  setDragging(true);
  store.dispatch.updateNodePos({ id, pos: {
    x: scaledClient.x - transform[0] - offset.x,
    y: scaledClient.y - transform[1] - offset.y
  }});
};

const onStop = ({ onNodeDragStop, setDragging, isDragging, id, type, position, data }): void => {
  if (isDragging) {
    setDragging(false);
    onNodeDragStop({
      id, type, position, data
    });
  }
};

export default NodeComponent => {
  const NodeWrapper = memo(({
    id, type, data, transform,
    xPos, yPos, selected, onClick,
    onNodeDragStop, style
  }: NodeComponentProps) => {
    const nodeElement = useRef<HTMLDivElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setDragging] = useState(false);

    const position = { x: xPos, y: yPos };
    const nodeClasses = cx('react-flow__node', { selected });
    const nodeStyle = { zIndex: selected ? 10 : 3, transform: `translate(${xPos}px,${yPos}px)` };

    const updateNode = () => {
      if (!nodeElement.current) {
        return false;
      }

      const storeState = store.getState()
      const bounds = nodeElement.current.getBoundingClientRect();
      const dimensions = getDimensions(nodeElement.current);
      const handleBounds = {
        source: getHandleBounds('.source', nodeElement.current, bounds, storeState.transform[2]),
        target: getHandleBounds('.target', nodeElement.current, bounds, storeState.transform[2])
      };
      store.dispatch.updateNodeData({ id, ...dimensions, handleBounds });
    };

    useEffect(() => {
      if (nodeElement.current) {
        updateNode();

        const resizeObserver = new ResizeObserver(entries => {
          for (let _ of entries) {
            updateNode();
          }
        });

        resizeObserver.observe(nodeElement.current);

        return () => {
          if (resizeObserver && nodeElement.current) {
            resizeObserver.unobserve(nodeElement.current);
          }
        }
      }
    }, [nodeElement.current]);

    return (
      <DraggableCore
        onStart={evt => onStart(evt, { onClick, id, type, data, setOffset, transform, position })}
        onDrag={evt => onDrag(evt, { setDragging, id, offset, transform })}
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
      </DraggableCore>
    );
  });

  NodeWrapper.displayName = 'NodeWrapper';

  return NodeWrapper;
};
