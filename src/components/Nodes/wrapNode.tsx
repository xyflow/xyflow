import React, {
  useEffect,
  useRef,
  useState,
  memo,
  ComponentType,
  CSSProperties,
  useMemo,
  MouseEvent,
  useCallback,
} from 'react';
import { DraggableCore } from 'react-draggable';
import cc from 'classcat';

import { ResizeObserver } from 'resize-observer';
import { useStoreActions } from '../../store/hooks';

import { Provider } from '../../contexts/NodeIdContext';
import {
  Node,
  XYPosition,
  Transform,
  ElementId,
  NodeComponentProps,
  WrapNodeProps,
  Elements,
  Edge,
  NodePosUpdate,
} from '../../types';

import { noop } from '../../utils';

const getMouseEvent = (evt: MouseEvent | TouchEvent) =>
  typeof TouchEvent !== 'undefined' && evt instanceof TouchEvent ? evt.touches[0] : (evt as MouseEvent);

interface OnDragStartParams {
  evt: MouseEvent | TouchEvent;
  id: ElementId;
  type: string;
  data: any;
  selectNodesOnDrag: boolean;
  isSelectable: boolean;
  setOffset: (pos: XYPosition) => void;
  transform: Transform;
  position: XYPosition;
  setSelectedElements: (elms: Elements | Node | Edge) => void;
  onNodeDragStart?: (node: Node) => void;
}

const onStart = ({
  evt,
  onNodeDragStart,
  id,
  type,
  data,
  selectNodesOnDrag,
  setOffset,
  transform,
  position,
  setSelectedElements,
  isSelectable,
}: OnDragStartParams): false | void => {
  const startEvt = getMouseEvent(evt);

  const scaledClient: XYPosition = {
    x: startEvt.clientX * (1 / transform[2]),
    y: startEvt.clientY * (1 / transform[2]),
  };

  const offsetX = scaledClient.x - position.x - transform[0];
  const offsetY = scaledClient.y - position.y - transform[1];
  const node = { id, type, position, data };

  setOffset({ x: offsetX, y: offsetY });

  if (onNodeDragStart) {
    onNodeDragStart(node);
  }

  if (selectNodesOnDrag && isSelectable) {
    setSelectedElements({ id, type } as Node);
  }
};

interface OnDragParams {
  evt: MouseEvent | TouchEvent;
  setDragging: (isDragging: boolean) => void;
  id: ElementId;
  offset: XYPosition;
  transform: Transform;
  updateNodePos: (params: NodePosUpdate) => void;
}

const onDrag = ({ evt, setDragging, id, offset, transform, updateNodePos }: OnDragParams): void => {
  const dragEvt = getMouseEvent(evt);

  const scaledClient = {
    x: dragEvt.clientX * (1 / transform[2]),
    y: dragEvt.clientY * (1 / transform[2]),
  };

  setDragging(true);
  updateNodePos({
    id,
    pos: {
      x: scaledClient.x - transform[0] - offset.x,
      y: scaledClient.y - transform[1] - offset.y,
    },
  });
};

interface OnDragStopParams {
  isDragging: boolean;
  setDragging: (isDragging: boolean) => void;
  id: ElementId;
  type: string;
  position: XYPosition;
  data: any;
  selectNodesOnDrag: boolean;
  isSelectable: boolean;
  setSelectedElements: (elms: Elements | Node | Edge) => void;
  onNodeDragStop?: (node: Node) => void;
  onClick?: (node: Node) => void;
}

const onStop = ({
  id,
  type,
  position,
  data,
  isDragging,
  setDragging,
  selectNodesOnDrag,
  isSelectable,
  onNodeDragStop,
  onClick,
  setSelectedElements,
}: OnDragStopParams): void => {
  const node = {
    id,
    type,
    position,
    data,
  } as Node;
  if (!isDragging && isSelectable) {
    if (!selectNodesOnDrag) {
      setSelectedElements({ id, type } as Node);
    }

    if (onClick) {
      return onClick(node);
    }
  }

  setDragging(false);

  if (onNodeDragStop) {
    onNodeDragStop(node);
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
      onMouseEnter,
      onMouseMove,
      onMouseLeave,
      onContextMenu,
      onNodeDragStart,
      onNodeDragStop,
      style,
      className,
      isDraggable,
      isSelectable,
      isConnectable,
      selectNodesOnDrag,
      sourcePosition,
      targetPosition,
      isHidden,
    }: WrapNodeProps) => {
      const updateNodeDimensions = useStoreActions((a) => a.updateNodeDimensions);
      const setSelectedElements = useStoreActions((a) => a.setSelectedElements);
      const updateNodePos = useStoreActions((a) => a.updateNodePos);

      const nodeElement = useRef<HTMLDivElement>(null);
      const [offset, setOffset] = useState({ x: 0, y: 0 });
      const [isDragging, setDragging] = useState(false);
      const position = { x: xPos, y: yPos };
      const nodeClasses = cc([
        'react-flow__node',
        `react-flow__node-${type}`,
        className,
        {
          selected,
          selectable: isSelectable,
        },
      ]);
      const node = { id, type, position, data };
      const onMouseEnterHandler = useMemo(() => {
        if (!onMouseEnter || isDragging) {
          return noop;
        }

        return (evt: MouseEvent) => onMouseEnter(evt, node);
      }, [onMouseEnter, isDragging]);

      const onMouseMoveHandler = useMemo(() => {
        if (!onMouseMove || isDragging) {
          return noop;
        }

        return (evt: MouseEvent) => onMouseMove(evt, node);
      }, [onMouseMove, isDragging]);

      const onMouseLeaveHandler = useMemo(() => {
        if (!onMouseLeave || isDragging) {
          return noop;
        }

        return (evt: MouseEvent) => onMouseLeave(evt, node);
      }, [onMouseLeave, isDragging]);

      const onContextMenuHandler = useMemo(() => {
        if (!onContextMenu) {
          return noop;
        }

        return (evt: MouseEvent) => onContextMenu(evt, node);
      }, [onContextMenu]);

      const onSelectNodeHandler = useCallback(() => {
        if (!isDraggable && isSelectable) {
          setSelectedElements({ id, type } as Node);
        }

        return noop;
      }, [isSelectable, isDraggable, id, type]);

      useEffect(() => {
        if (nodeElement.current) {
          updateNodeDimensions({ id, nodeElement: nodeElement.current });

          const resizeObserver = new ResizeObserver((entries) => {
            for (let _ of entries) {
              updateNodeDimensions({ id, nodeElement: nodeElement.current! });
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
      }, [id]);

      if (isHidden) {
        return null;
      }

      const nodeStyle: CSSProperties = {
        zIndex: selected ? 10 : 3,
        transform: `translate(${xPos}px,${yPos}px)`,
        pointerEvents: isSelectable || isDraggable ? 'all' : 'none',
        ...style,
      };

      return (
        <DraggableCore
          onStart={(evt) =>
            onStart({
              evt: evt as MouseEvent,
              selectNodesOnDrag,
              isSelectable,
              onNodeDragStart,
              id,
              type,
              data,
              setOffset,
              transform,
              position,
              setSelectedElements,
            })
          }
          onDrag={(evt) => onDrag({ evt: evt as MouseEvent, setDragging, id, offset, transform, updateNodePos })}
          onStop={() =>
            onStop({
              onNodeDragStop,
              selectNodesOnDrag,
              isSelectable,
              onClick,
              isDragging,
              setDragging,
              id,
              type,
              position,
              data,
              setSelectedElements,
            })
          }
          scale={transform[2]}
          disabled={!isDraggable}
          cancel=".nodrag"
        >
          <div
            className={nodeClasses}
            ref={nodeElement}
            style={nodeStyle}
            onMouseEnter={onMouseEnterHandler}
            onMouseMove={onMouseMoveHandler}
            onMouseLeave={onMouseLeaveHandler}
            onContextMenu={onContextMenuHandler}
            onClick={onSelectNodeHandler}
          >
            <Provider value={id}>
              <NodeComponent
                id={id}
                data={data}
                type={type}
                selected={selected}
                isConnectable={isConnectable}
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
