import React, { useEffect, useRef, useState, memo, ComponentType, CSSProperties } from 'react';
import { DraggableCore } from 'react-draggable';
import cx from 'classnames';
import { ResizeObserver } from 'resize-observer';

import { Provider } from '../../contexts/NodeIdContext';
import store from '../../store';
import { Node, XYPosition, Transform, ElementId, NodeComponentProps, WrapNodeProps } from '../../types';

const getMouseEvent = (evt: MouseEvent | TouchEvent) =>
  typeof TouchEvent !== 'undefined' && evt instanceof TouchEvent ? evt.touches[0] : (evt as MouseEvent);

const onStart = (
  evt: MouseEvent | TouchEvent,
  onDragStart: (node: Node) => void,
  id: ElementId,
  type: string,
  data: any,
  setOffset: (pos: XYPosition) => void,
  transform: Transform,
  position: XYPosition
): false | void => {
  const startEvt = getMouseEvent(evt);

  const scaledClient: XYPosition = {
    x: startEvt.clientX * (1 / transform[2]),
    y: startEvt.clientY * (1 / transform[2]),
  };

  const offsetX = scaledClient.x - position.x - transform[0];
  const offsetY = scaledClient.y - position.y - transform[1];
  const node = { id, type, position, data };

  store.dispatch.setSelectedElements({ id, type } as Node);
  setOffset({ x: offsetX, y: offsetY });
  onDragStart(node);
};

const onDrag = (
  evt: MouseEvent | TouchEvent,
  setDragging: (isDragging: boolean) => void,
  id: ElementId,
  offset: XYPosition,
  transform: Transform
): void => {
  const dragEvt = getMouseEvent(evt);

  const scaledClient = {
    x: dragEvt.clientX * (1 / transform[2]),
    y: dragEvt.clientY * (1 / transform[2]),
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
  onDragStop: (node: Node) => void,
  onClick: (node: Node) => void,
  isDragging: boolean,
  setDragging: (isDragging: boolean) => void,
  id: ElementId,
  type: string,
  position: XYPosition,
  data: any
): void => {
  const node = {
    id,
    type,
    position,
    data,
  } as Node;

  if (!isDragging) {
    return onClick(node);
  }

  setDragging(false);
  onDragStop(node);
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
      onNodeDragStart,
      onNodeDragStop,
      style,
      isInteractive,
      sourcePosition,
      targetPosition,
    }: WrapNodeProps) => {
      const nodeElement = useRef<HTMLDivElement>(null);
      const [offset, setOffset] = useState({ x: 0, y: 0 });
      const [isDragging, setDragging] = useState(false);
      const position = { x: xPos, y: yPos };
      const nodeClasses = cx('react-flow__node', { selected });
      const nodeStyle: CSSProperties = {
        zIndex: selected ? 10 : 3,
        transform: `translate(${xPos}px,${yPos}px)`,
        pointerEvents: isInteractive ? 'all' : 'none',
      };

      const updateNode = (): void => {
        if (!nodeElement.current) {
          return;
        }

        store.dispatch.updateNodeDimensions({ id, nodeElement: nodeElement.current });
      };

      useEffect(() => {
        if (nodeElement.current) {
          updateNode();

          const resizeObserver = new ResizeObserver((entries) => {
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
      }, []);

      return (
        <DraggableCore
          onStart={(evt) => onStart(evt as MouseEvent, onNodeDragStart, id, type, data, setOffset, transform, position)}
          onDrag={(evt) => onDrag(evt as MouseEvent, setDragging, id, offset, transform)}
          onStop={() => onStop(onNodeDragStop, onClick, isDragging, setDragging, id, type, position, data)}
          scale={transform[2]}
          disabled={!isInteractive}
          cancel=".nodrag"
        >
          <div className={nodeClasses} ref={nodeElement} style={nodeStyle}>
            <Provider value={id}>
              <NodeComponent
                id={id}
                data={data}
                type={type}
                style={style}
                selected={selected}
                sourcePosition={sourcePosition}
                targetPosition={targetPosition}
              />
            </Provider>
          </div>
        </DraggableCore>
      );
    }
  );

  NodeWrapper.displayName = 'NodeWrapper';

  return NodeWrapper;
};
