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
import { Node, NodeComponentProps, WrapNodeProps } from '../../types';

const getMouseEvent = (event: MouseEvent | TouchEvent) =>
  typeof TouchEvent !== 'undefined' && event instanceof TouchEvent ? event.touches[0] : (event as MouseEvent);

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

    const position = useMemo(() => ({ x: xPos, y: yPos }), [xPos, yPos]);
    const node = useMemo(() => ({ id, type, position, data }), [id, type, position, data]);
    const nodeStyle: CSSProperties = useMemo(
      () => ({
        zIndex: selected ? 10 : 3,
        transform: `translate(${xPos}px,${yPos}px)`,
        pointerEvents: isSelectable || isDraggable || onClick ? 'all' : 'none',
        opacity: isInitialized ? 1 : 0, // prevents jumping of nodes on start
        ...style,
      }),
      [selected, xPos, yPos, isSelectable, isDraggable, onClick, isInitialized, style]
    );
    const onMouseEnterHandler = useMemo(() => {
      if (!onMouseEnter || isDragging) {
        return;
      }

      return (event: MouseEvent) => onMouseEnter(event, node);
    }, [onMouseEnter, isDragging, node]);

    const onMouseMoveHandler = useMemo(() => {
      if (!onMouseMove || isDragging) {
        return;
      }

      return (event: MouseEvent) => onMouseMove(event, node);
    }, [onMouseMove, isDragging, node]);

    const onMouseLeaveHandler = useMemo(() => {
      if (!onMouseLeave || isDragging) {
        return;
      }

      return (event: MouseEvent) => onMouseLeave(event, node);
    }, [onMouseLeave, isDragging, node]);

    const onContextMenuHandler = useMemo(() => {
      if (!onContextMenu) {
        return;
      }

      return (event: MouseEvent) => onContextMenu(event, node);
    }, [onContextMenu, node]);

    const onSelectNodeHandler = useCallback(
      (event: MouseEvent) => {
        if (!isDraggable) {
          if (isSelectable) {
            setSelectedElements({ id: node.id, type: node.type } as Node);
          }

          if (onClick) {
            onClick(event, node);
          }
        }
      },
      [isSelectable, isDraggable, onClick, node]
    );

    const onDragStart = useCallback(
      (event) => {
        const startEvent = getMouseEvent(event);

        const scaledClientX = startEvent.clientX / transform[2];
        const scaledClientY = startEvent.clientY / transform[2];

        const offsetX = scaledClientX - position.x - transform[0];
        const offsetY = scaledClientY - position.y - transform[1];

        setOffset({ x: offsetX, y: offsetY });

        if (onNodeDragStart) {
          onNodeDragStart(event as MouseEvent, node);
        }

        if (selectNodesOnDrag && isSelectable) {
          setSelectedElements({ id: node.id, type: node.type } as Node);
        }
      },
      [node, transform, position, selectNodesOnDrag, isSelectable, onNodeDragStart]
    );

    const onDrag = useCallback(
      (event) => {
        const dragEvent = getMouseEvent(event);

        const scaledClientX = dragEvent.clientX / transform[2];
        const scaledClientY = dragEvent.clientY / transform[2];

        setDragging(true);
        updateNodePos({
          id,
          pos: {
            x: scaledClientX - transform[0] - offset.x,
            y: scaledClientY - transform[1] - offset.y,
          },
        });
      },
      [id, transform, offset]
    );

    const onDragStop = useCallback(
      (event) => {
        if (!isDragging) {
          if (isSelectable && !selectNodesOnDrag) {
            setSelectedElements({ id: node.id, type: node.type } as Node);
          }

          if (onClick) {
            onClick(event as MouseEvent, node);
          }

          return;
        }

        setDragging(false);

        if (onNodeDragStop) {
          onNodeDragStop(event as MouseEvent, node);
        }
      },
      [node, isDragging, isSelectable, selectNodesOnDrag, onClick, onNodeDragStop]
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

    const nodeClasses = cc([
      'react-flow__node',
      `react-flow__node-${type}`,
      className,
      {
        selected,
        selectable: isSelectable,
      },
    ]);

    return (
      <DraggableCore
        onStart={onDragStart}
        onDrag={onDrag}
        onStop={onDragStop}
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
