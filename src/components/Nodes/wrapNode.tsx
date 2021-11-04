import React, { useEffect, useRef, memo, ComponentType, CSSProperties, useMemo, MouseEvent, useCallback } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { Provider } from '../../contexts/NodeIdContext';
import { NodeComponentProps, WrapNodeProps, ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => ({
  addSelectedElements: s.addSelectedElements,
  unsetNodesSelection: s.unsetNodesSelection,
  updateNodePosition: s.updateNodePosition,
  updateNodeDimensions: s.updateNodeDimensions,
  unselectNodesAndEdges: s.unselectNodesAndEdges,
});

export default (NodeComponent: ComponentType<NodeComponentProps>) => {
  const NodeWrapper = ({
    id,
    type,
    data,
    scale,
    xPos,
    yPos,
    isSelected,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onContextMenu,
    onNodeDoubleClick,
    onNodeDragStart,
    onNodeDrag,
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
    resizeObserver,
    dragHandle,
    zIndex,
    isParentNode,
  }: WrapNodeProps) => {
    const {
      addSelectedElements,
      unselectNodesAndEdges,
      unsetNodesSelection,
      updateNodePosition,
      updateNodeDimensions,
    } = useStore(selector, shallow);
    const nodeElement = useRef<HTMLDivElement>(null);

    const node = useMemo(() => ({ id, type, position: { x: xPos, y: yPos }, data }), [id, type, xPos, yPos, data]);
    const grid = useMemo(() => (snapToGrid ? snapGrid : [1, 1])! as [number, number], [snapToGrid, snapGrid]);

    const nodeStyle: CSSProperties = useMemo(
      () => ({
        zIndex,
        transform: `translate(${xPos}px,${yPos}px)`,
        pointerEvents:
          isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave ? 'all' : 'none',
        // prevents jumping of nodes on start
        opacity: isInitialized ? 1 : 0,
        ...style,
      }),
      [
        isSelected,
        xPos,
        yPos,
        isSelectable,
        isDraggable,
        onClick,
        isInitialized,
        style,
        onMouseEnter,
        onMouseMove,
        onMouseLeave,
        isParentNode,
        zIndex,
      ]
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

            if (!isSelected) {
              addSelectedElements([node]);
            }
          }

          onClick?.(event, node);
        }
      },
      [isSelectable, isSelected, isDraggable, onClick, node]
    );

    const onDragStart = useCallback(
      (event: DraggableEvent) => {
        onNodeDragStart?.(event as MouseEvent, node);

        if (selectNodesOnDrag && isSelectable) {
          unsetNodesSelection();

          if (!isSelected) {
            addSelectedElements([node]);
          }
        } else if (!selectNodesOnDrag && !isSelected && isSelectable) {
          unselectNodesAndEdges();
          unsetNodesSelection();
        }
      },
      [node, isSelected, selectNodesOnDrag, isSelectable, onNodeDragStart]
    );

    const onDrag = useCallback(
      (event: DraggableEvent, draggableData: DraggableData) => {
        node.position.x += draggableData.deltaX;
        node.position.y += draggableData.deltaY;

        if (onNodeDrag) {
          onNodeDrag(event as MouseEvent, node);
        }

        updateNodePosition({ id, isDragging: true, diff: { x: draggableData.deltaX, y: draggableData.deltaY } });
      },
      [id, node, onNodeDrag]
    );

    const onDragStop = useCallback(
      (event: DraggableEvent) => {
        // onDragStop also gets called when user just clicks on a node.
        // Because of that we set dragging to true inside the onDrag handler and handle the click here
        if (!isDragging) {
          if (isSelectable && !selectNodesOnDrag && !isSelected) {
            addSelectedElements([node]);
          }

          onClick?.(event as MouseEvent, node);

          return;
        }

        updateNodePosition({
          id: node.id,
          isDragging: false,
        });

        onNodeDragStop?.(event as MouseEvent, node);
      },
      [node, isSelectable, selectNodesOnDrag, onClick, onNodeDragStop, isDragging, isSelected]
    );

    const onNodeDoubleClickHandler = useCallback(
      (event: MouseEvent) => {
        onNodeDoubleClick?.(event, node);
      },
      [node, onNodeDoubleClick]
    );

    useEffect(() => {
      if (nodeElement.current && (!isHidden || !isInitialized)) {
        updateNodeDimensions([{ id, nodeElement: nodeElement.current, forceUpdate: true }]);
      }
    }, [id, isHidden, sourcePosition, targetPosition, type, isInitialized]);

    useEffect(() => {
      if (nodeElement.current) {
        const currNode = nodeElement.current;
        resizeObserver?.observe(currNode);

        return () => resizeObserver?.unobserve(currNode);
      }
    }, []);

    if (isHidden) {
      return null;
    }

    const nodeClasses = cc([
      'react-flow__node',
      `react-flow__node-${type}`,
      className,
      {
        selected: isSelected,
        selectable: isSelectable,
        parent: isParentNode,
      },
    ]);

    return (
      <DraggableCore
        onStart={onDragStart}
        onDrag={onDrag}
        onStop={onDragStop}
        scale={scale}
        disabled={!isDraggable}
        cancel=".nodrag"
        nodeRef={nodeElement}
        grid={grid}
        enableUserSelectHack={false}
        handle={dragHandle}
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
          onDoubleClick={onNodeDoubleClickHandler}
          data-id={id}
        >
          <Provider value={id}>
            <NodeComponent
              id={id}
              data={data}
              type={type}
              xPos={xPos}
              yPos={yPos}
              isSelected={isSelected}
              isConnectable={isConnectable}
              sourcePosition={sourcePosition}
              targetPosition={targetPosition}
              isDragging={isDragging}
              dragHandle={dragHandle}
            />
          </Provider>
        </div>
      </DraggableCore>
    );
  };

  NodeWrapper.displayName = 'NodeWrapper';

  return memo(NodeWrapper);
};
