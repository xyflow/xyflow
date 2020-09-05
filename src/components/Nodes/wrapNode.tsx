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

const getMouseEvent = (event: MouseEvent | TouchEvent) =>
  typeof TouchEvent !== 'undefined' && event instanceof TouchEvent ? event.touches[0] : (event as MouseEvent);

interface OnDragStartParams {
  event: MouseEvent | TouchEvent;
  id: ElementId;
  type: string;
  data: any;
  selectNodesOnDrag: boolean;
  isSelectable: boolean;
  setOffset: (pos: XYPosition) => void;
  transform: Transform;
  position: XYPosition;
  setSelectedElements: (elms: Elements | Node | Edge) => void;
  onNodeDragStart?: (event: MouseEvent, node: Node) => void;
}

const onStart = ({
  event,
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
  const startEvent = getMouseEvent(event);

  const scaledClient: XYPosition = {
    x: startEvent.clientX * (1 / transform[2]),
    y: startEvent.clientY * (1 / transform[2]),
  };

  const offsetX = scaledClient.x - position.x - transform[0];
  const offsetY = scaledClient.y - position.y - transform[1];
  const node = { id, type, position, data };

  setOffset({ x: offsetX, y: offsetY });

  if (onNodeDragStart) {
    onNodeDragStart(event as MouseEvent, node);
  }

  if (selectNodesOnDrag && isSelectable) {
    setSelectedElements({ id, type } as Node);
  }
};

interface OnDragParams {
  event: MouseEvent | TouchEvent;
  setDragging: (isDragging: boolean) => void;
  id: ElementId;
  offset: XYPosition;
  transform: Transform;
  updateNodePos: (params: NodePosUpdate) => void;
}

const onDrag = ({ event, setDragging, id, offset, transform, updateNodePos }: OnDragParams): void => {
  const dragEvent = getMouseEvent(event);

  const scaledClient = {
    x: dragEvent.clientX / transform[2],
    y: dragEvent.clientY / transform[2],
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
  event: MouseEvent;
  isDragging: boolean;
  setDragging: (isDragging: boolean) => void;
  id: ElementId;
  type: string;
  position: XYPosition;
  data: any;
  selectNodesOnDrag: boolean;
  isSelectable: boolean;
  setSelectedElements: (elms: Elements | Node | Edge) => void;
  onNodeDragStop?: (event: MouseEvent, node: Node) => void;
  onClick?: (event: MouseEvent, node: Node) => void;
}

const onStop = ({
  event,
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
      return onClick(event, node);
    }
  }

  setDragging(false);

  if (onNodeDragStop) {
    onNodeDragStop(event, node);
  }
};

export default (NodeComponent: ComponentType<NodeComponentProps>) => {
  const NodeWrapper = ({
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
    isInitialized,
  }: WrapNodeProps) => {
    const updateNodeDimensions = useStoreActions((actions) => actions.updateNodeDimensions);
    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);
    const updateNodePos = useStoreActions((actions) => actions.updateNodePos);

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

      return (event: MouseEvent) => onMouseEnter(event, node);
    }, [onMouseEnter, isDragging]);

    const onMouseMoveHandler = useMemo(() => {
      if (!onMouseMove || isDragging) {
        return noop;
      }

      return (event: MouseEvent) => onMouseMove(event, node);
    }, [onMouseMove, isDragging]);

    const onMouseLeaveHandler = useMemo(() => {
      if (!onMouseLeave || isDragging) {
        return noop;
      }

      return (event: MouseEvent) => onMouseLeave(event, node);
    }, [onMouseLeave, isDragging]);

    const onContextMenuHandler = useMemo(() => {
      if (!onContextMenu) {
        return noop;
      }

      return (event: MouseEvent) => onContextMenu(event, node);
    }, [onContextMenu]);

    const onSelectNodeHandler = useCallback(
      (event: MouseEvent) => {
        if (!isDraggable && isSelectable) {
          setSelectedElements({ id: node.id, type: node.type } as Node);
        }

        if (onClick) {
          onClick(event, node);
        }
      },
      [isSelectable, isDraggable, node]
    );

    useEffect(() => {
      if (nodeElement.current) {
        updateNodeDimensions({ id, nodeElement: nodeElement.current });

        const resizeObserver = new ResizeObserver((entries) => {
          for (let _ of entries) {
            if (nodeElement.current) {
              updateNodeDimensions({ id, nodeElement: nodeElement.current });
            }
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
      pointerEvents: isSelectable || isDraggable || onClick ? 'all' : 'none',
      opacity: isInitialized ? 1 : 0, // prevents jumping of nodes on start
      ...style,
    };

    return (
      <DraggableCore
        onStart={(event) =>
          onStart({
            event: event as MouseEvent,
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
        onDrag={(event) => onDrag({ event: event as MouseEvent, setDragging, id, offset, transform, updateNodePos })}
        onStop={(event) =>
          onStop({
            event: event as MouseEvent,
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
        nodeRef={nodeElement}
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
  };

  NodeWrapper.displayName = 'NodeWrapper';

  return memo(NodeWrapper);
};
