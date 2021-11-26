import React, { useEffect, useRef, memo, ComponentType, CSSProperties, useMemo, MouseEvent, useCallback } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore } from '../../store';
import { Provider } from '../../contexts/NodeIdContext';
import { NodeProps, WrapNodeProps, ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => ({
  addSelectedNodes: s.addSelectedNodes,
  setNodesSelectionActive: s.setNodesSelectionActive,
  updateNodePosition: s.updateNodePosition,
  updateNodeDimensions: s.updateNodeDimensions,
  unselectNodesAndEdges: s.unselectNodesAndEdges,
});

export default (NodeComponent: ComponentType<NodeProps>) => {
  const NodeWrapper = ({
    id,
    type,
    data,
    scale,
    xPos,
    yPos,
    selected,
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
    hidden,
    isInitialized,
    snapToGrid,
    snapGrid,
    dragging,
    resizeObserver,
    dragHandle,
    zIndex,
    isParent,
    noPanClassName,
    noDragClassName,
  }: WrapNodeProps) => {
    const {
      addSelectedNodes,
      unselectNodesAndEdges,
      setNodesSelectionActive,
      updateNodePosition,
      //  updateNodeDimensions,
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
        isParent,
        zIndex,
      ]
    );

    const onMouseEnterHandler = useMemo(() => {
      if (!onMouseEnter || dragging) {
        return;
      }

      return (event: MouseEvent) => onMouseEnter(event, node);
    }, [onMouseEnter, dragging, node]);

    const onMouseMoveHandler = useMemo(() => {
      if (!onMouseMove || dragging) {
        return;
      }

      return (event: MouseEvent) => onMouseMove(event, node);
    }, [onMouseMove, dragging, node]);

    const onMouseLeaveHandler = useMemo(() => {
      if (!onMouseLeave || dragging) {
        return;
      }

      return (event: MouseEvent) => onMouseLeave(event, node);
    }, [onMouseLeave, dragging, node]);

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
            setNodesSelectionActive(false);

            if (!selected) {
              addSelectedNodes([node.id]);
            }
          }

          onClick?.(event, node);
        }
      },
      [isSelectable, selected, isDraggable, onClick, node]
    );

    const onDragStart = useCallback(
      (event: DraggableEvent) => {
        onNodeDragStart?.(event as MouseEvent, node);

        if (selectNodesOnDrag && isSelectable) {
          setNodesSelectionActive(false);

          if (!selected) {
            addSelectedNodes([node.id]);
          }
        } else if (!selectNodesOnDrag && !selected && isSelectable) {
          unselectNodesAndEdges();
          setNodesSelectionActive(false);
        }
      },
      [node, selected, selectNodesOnDrag, isSelectable, onNodeDragStart]
    );

    const onDrag = useCallback(
      (event: DraggableEvent, draggableData: DraggableData) => {
        node.position.x += draggableData.deltaX;
        node.position.y += draggableData.deltaY;

        onNodeDrag?.(event as MouseEvent, node);

        updateNodePosition({ id, dragging: true, diff: { x: draggableData.deltaX, y: draggableData.deltaY } });
      },
      [id, node, onNodeDrag]
    );

    const onDragStop = useCallback(
      (event: DraggableEvent) => {
        // onDragStop also gets called when user just clicks on a node.
        // Because of that we set dragging to true inside the onDrag handler and handle the click here
        if (!dragging) {
          if (isSelectable && !selectNodesOnDrag && !selected) {
            addSelectedNodes([node.id]);
          }

          onClick?.(event as MouseEvent, node);

          return;
        }

        updateNodePosition({
          id: node.id,
          dragging: false,
        });

        onNodeDragStop?.(event as MouseEvent, node);
      },
      [node, isSelectable, selectNodesOnDrag, onClick, onNodeDragStop, dragging, selected]
    );

    const onNodeDoubleClickHandler = useCallback(
      (event: MouseEvent) => {
        onNodeDoubleClick?.(event, node);
      },
      [node, onNodeDoubleClick]
    );

    useEffect(() => {
      if (nodeElement.current && !hidden) {
        const currNode = nodeElement.current;
        resizeObserver?.observe(currNode);

        return () => resizeObserver?.unobserve(currNode);
      }
    }, [hidden]);

    if (hidden) {
      return null;
    }

    const nodeClasses = cc([
      'react-flow__node',
      `react-flow__node-${type}`,
      noPanClassName,
      className,
      {
        selected,
        selectable: isSelectable,
        parent: isParent,
      },
    ]);

    return (
      <DraggableCore
        onStart={onDragStart}
        onDrag={onDrag}
        onStop={onDragStop}
        scale={scale}
        disabled={!isDraggable}
        cancel={`.${noDragClassName}`}
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
              selected={selected}
              isConnectable={isConnectable}
              sourcePosition={sourcePosition}
              targetPosition={targetPosition}
              dragging={dragging}
              dragHandle={dragHandle}
              zIndex={zIndex}
            />
          </Provider>
        </div>
      </DraggableCore>
    );
  };

  NodeWrapper.displayName = 'NodeWrapper';

  return memo(NodeWrapper);
};
