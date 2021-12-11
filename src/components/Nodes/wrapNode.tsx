import React, { useEffect, useRef, memo, ComponentType, CSSProperties, useMemo, MouseEvent, useCallback } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import { Provider } from '../../contexts/NodeIdContext';
import { NodeProps, WrapNodeProps, ReactFlowState } from '../../types';

const selector = (s: ReactFlowState) => ({
  addSelectedNodes: s.addSelectedNodes,
  updateNodePosition: s.updateNodePosition,
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
    const store = useStoreApi();
    const { addSelectedNodes, unselectNodesAndEdges, updateNodePosition } = useStore(selector, shallow);
    const nodeElement = useRef<HTMLDivElement>(null);
    const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
    const nodeStyle: CSSProperties = useMemo(
      () => ({
        zIndex,
        transform: `translate(${xPos}px,${yPos}px)`,
        pointerEvents: hasPointerEvents ? 'all' : 'none',
        // prevents jumping of nodes on start
        opacity: isInitialized ? 1 : 0,
        ...style,
      }),
      [zIndex, xPos, yPos, hasPointerEvents, isInitialized, style]
    );

    const node = useMemo(() => ({ id, type, position: { x: xPos, y: yPos }, data }), [id, type, xPos, yPos, data]);
    const grid = useMemo(() => (snapToGrid ? snapGrid : [1, 1])! as [number, number], [snapToGrid, snapGrid]);

    const onMouseEnterHandler = useCallback(
      (event: MouseEvent) => {
        if (onMouseEnter && !dragging) {
          onMouseEnter(event, node);
        }
      },
      [onMouseEnter, dragging, node]
    );

    const onMouseMoveHandler = useCallback(
      (event: MouseEvent) => {
        if (onMouseMove && !dragging) {
          onMouseMove(event, node);
        }
      },
      [onMouseMove, dragging, node]
    );

    const onMouseLeaveHandler = useCallback(
      (event: MouseEvent) => {
        if (onMouseLeave && !dragging) {
          onMouseLeave?.(event, node);
        }
      },
      [onMouseLeave, dragging, node]
    );

    const onContextMenuHandler = useCallback(
      (event: MouseEvent) => onContextMenu?.(event, node),
      [onContextMenu, node]
    );

    const onSelectNodeHandler = useCallback(
      (event: MouseEvent) => {
        if (!isDraggable) {
          if (isSelectable) {
            store.setState({ nodesSelectionActive: false });

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
          store.setState({ nodesSelectionActive: false });

          if (!selected) {
            addSelectedNodes([node.id]);
          }
        } else if (!selectNodesOnDrag && !selected && isSelectable) {
          unselectNodesAndEdges();
          store.setState({ nodesSelectionActive: false });
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
