import React, { useEffect, useRef, memo, ComponentType, CSSProperties, useMemo, MouseEvent, useCallback } from 'react';
import { DraggableCore } from 'react-draggable';
import cc from 'classcat';
import { ResizeObserver } from 'resize-observer';

import { useStoreActions } from '../../store/hooks';
import { Provider } from '../../contexts/NodeIdContext';
import { Node, NodeComponentProps, WrapNodeProps } from '../../types';

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
    snapToGrid,
    snapGrid,
    isDragging,
  }: WrapNodeProps) => {
    const updateNodeDimensions = useStoreActions((actions) => actions.updateNodeDimensions);
    const setSelectedElements = useStoreActions((actions) => actions.setSelectedElements);
    const updateNodePosDiff = useStoreActions((actions) => actions.updateNodePosDiff);
    const unsetNodesSelection = useStoreActions((actions) => actions.unsetNodesSelection);

    const nodeElement = useRef<HTMLDivElement>(null);

    const node = useMemo(() => ({ id, type, position: { x: xPos, y: yPos }, data }), [id, type, xPos, yPos, data]);
    const grid = useMemo(() => (snapToGrid ? snapGrid : [1, 1])! as [number, number], [snapToGrid, snapGrid]);

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
            unsetNodesSelection();
            setSelectedElements({ id: node.id, type: node.type } as Node);
          }

          onClick?.(event, node);
        }
      },
      [isSelectable, isDraggable, onClick, node]
    );

    const onDragStart = useCallback(
      (event) => {
        onNodeDragStart?.(event as MouseEvent, node);

        if (selectNodesOnDrag && isSelectable) {
          unsetNodesSelection();
          setSelectedElements({ id: node.id, type: node.type } as Node);
        }
      },
      [node, selectNodesOnDrag, isSelectable, onNodeDragStart]
    );

    const onDrag = useCallback(
      (_, data) => {
        updateNodePosDiff({
          id,
          diff: {
            x: data.deltaX,
            y: data.deltaY,
          },
        });
      },
      [id]
    );

    const onDragStop = useCallback(
      (event) => {
        // onDragStop also gets called when user just clicks on a node.
        // Because of that we set dragging to true inside the onDrag handler and handle the click here
        if (!isDragging) {
          if (isSelectable && !selectNodesOnDrag) {
            setSelectedElements({ id: node.id, type: node.type } as Node);
          }

          onClick?.(event as MouseEvent, node);

          return;
        }

        updateNodePosDiff({
          id,
          isDragging: false,
        });

        onNodeDragStop?.(event as MouseEvent, node);
      },
      [node, isSelectable, selectNodesOnDrag, onClick, onNodeDragStop, isDragging]
    );

    useEffect(() => {
      if (nodeElement.current && !isHidden) {
        updateNodeDimensions({ id, nodeElement: nodeElement.current });

        const resizeObserver = new ResizeObserver(() => {
          if (nodeElement.current) {
            updateNodeDimensions({ id, nodeElement: nodeElement.current });
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
    }, [id, isHidden]);

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
        grid={grid}
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
