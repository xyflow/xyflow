import React, { useEffect, useRef, useState, memo, ComponentType } from 'react';
import { DraggableCore, DraggableEvent } from 'react-draggable';
import cx from 'classnames';
import { ResizeObserver } from 'resize-observer';

import { getDimensions, isInputDOMNode } from '../../utils';
import { Provider } from '../../contexts/NodeIdContext';
import store from '../../store';
import {
  Node,
  XYPosition,
  HandleElement,
  Position,
  Transform,
  ElementId,
  NodeComponentProps,
  WrapNodeProps,
} from '../../types';

const isHandle = (evt: MouseEvent | DraggableEvent) => {
  const target = evt.target as HTMLElement;

  return (
    target.className &&
    target.className.includes &&
    (target.className.includes('source') || target.className.includes('target'))
  );
};

const getHandleBounds = (
  selector: string,
  nodeElement: HTMLDivElement,
  parentBounds: ClientRect | DOMRect,
  k: number
): HandleElement[] | null => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return null;
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];

  return handlesArray.map(
    (handle): HandleElement => {
      const bounds = handle.getBoundingClientRect();
      const dimensions = getDimensions(handle);
      const nodeIdAttr = handle.getAttribute('data-nodeid');
      const handlePosition = (handle.getAttribute('data-handlepos') as unknown) as Position;
      const nodeIdSplitted = nodeIdAttr ? nodeIdAttr.split('__') : null;

      let handleId = null;

      if (nodeIdSplitted) {
        handleId = (nodeIdSplitted.length ? nodeIdSplitted[1] : nodeIdSplitted) as string;
      }

      return {
        id: handleId,
        position: handlePosition,
        x: (bounds.left - parentBounds.left) * (1 / k),
        y: (bounds.top - parentBounds.top) * (1 / k),
        ...dimensions,
      };
    }
  );
};

const onStart = (
  evt: MouseEvent,
  onClick: (node: Node) => void,
  id: ElementId,
  type: string,
  data: any,
  setOffset: (pos: XYPosition) => void,
  transform: Transform,
  position: XYPosition
): false | void => {
  if (isInputDOMNode(evt) || isHandle(evt)) {
    return false;
  }

  const scaledClient: XYPosition = {
    x: evt.clientX * (1 / transform[2]),
    y: evt.clientY * (1 / transform[2]),
  };
  const offsetX = scaledClient.x - position.x - transform[0];
  const offsetY = scaledClient.y - position.y - transform[1];
  const node = { id, type, position, data };

  store.dispatch.setSelectedElements({ id, type } as Node);
  setOffset({ x: offsetX, y: offsetY });
  onClick(node);
};

const onDrag = (
  evt: MouseEvent,
  setDragging: (isDragging: boolean) => void,
  id: ElementId,
  offset: XYPosition,
  transform: Transform
): void => {
  const scaledClient = {
    x: evt.clientX * (1 / transform[2]),
    y: evt.clientY * (1 / transform[2]),
  };

  setDragging(true);
  store.dispatch.updateNodePos({
    id,
    pos: {
      x: scaledClient.x - transform[0] - offset.x,
      y: scaledClient.y - transform[1] - offset.y,
    },
  });
};

const onStop = (
  onNodeDragStop: (params: Node) => void,
  isDragging: boolean,
  setDragging: (isDragging: boolean) => void,
  id: ElementId,
  type: string,
  position: XYPosition,
  data: any
): void => {
  if (isDragging) {
    setDragging(false);
    onNodeDragStop({
      id,
      type,
      position,
      data,
    } as Node);
  }
};

export default (NodeComponent: ComponentType<NodeComponentProps>) => {
  const NodeWrapper = memo(
    ({
      id,
      type,
      data,
      transform,
      xPos,
      yPos,
      selected,
      onClick,
      onNodeDragStop,
      style,
      isInteractive,
    }: WrapNodeProps) => {
      const nodeElement = useRef<HTMLDivElement>(null);
      const [offset, setOffset] = useState({ x: 0, y: 0 });
      const [isDragging, setDragging] = useState(false);

      const position = { x: xPos, y: yPos };
      const nodeClasses = cx('react-flow__node', { selected });
      const nodeStyle = {
        zIndex: selected ? 10 : 3,
        transform: `translate(${xPos}px,${yPos}px)`,
      };

      const updateNode = (): void => {
        if (!nodeElement.current) {
          return;
        }

        const storeState = store.getState();
        const bounds = nodeElement.current.getBoundingClientRect();
        const dimensions = getDimensions(nodeElement.current);
        const handleBounds = {
          source: getHandleBounds('.source', nodeElement.current, bounds, storeState.transform[2]),
          target: getHandleBounds('.target', nodeElement.current, bounds, storeState.transform[2]),
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
          };
        }

        return;
      }, [nodeElement.current]);

      return (
        <DraggableCore
          onStart={evt => onStart(evt as MouseEvent, onClick, id, type, data, setOffset, transform, position)}
          onDrag={evt => onDrag(evt as MouseEvent, setDragging, id, offset, transform)}
          onStop={() => onStop(onNodeDragStop, isDragging, setDragging, id, type, position, data)}
          scale={transform[2]}
          disabled={!isInteractive}
        >
          <div className={nodeClasses} ref={nodeElement} style={nodeStyle}>
            <Provider value={id}>
              <NodeComponent id={id} data={data} type={type} style={style} selected={selected} />
            </Provider>
          </div>
        </DraggableCore>
      );
    }
  );

  NodeWrapper.displayName = 'NodeWrapper';

  return NodeWrapper;
};
