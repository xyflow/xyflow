import React, { useEffect, useRef, memo, ComponentType, CSSProperties, useMemo, MouseEvent, useCallback } from 'react';
import { DraggableCore, DraggableData, DraggableEvent } from 'react-draggable';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import { Provider } from '../../contexts/NodeIdContext';
import { NodeProps, WrapNodeProps, ReactFlowState } from '../../types';
import useMemoizedMouseHandler from './useMemoizedMouseHandler';

const selector = (s: ReactFlowState) => ({
  addSelectedNodes: s.addSelectedNodes,
  updateNodePosition: s.updateNodePosition,
  unselectNodesAndEdges: s.unselectNodesAndEdges,
  updateNodeDimensions: s.updateNodeDimensions,
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
    const { addSelectedNodes, unselectNodesAndEdges, updateNodePosition, updateNodeDimensions } = useStore(
      selector,
      shallow
    );
    const nodeElement = useRef<HTMLDivElement>(null);
    const prevSourcePosition = useRef(sourcePosition);
    const prevTargetPosition = useRef(targetPosition);
    const prevType = useRef(type);
    const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
    const nodeStyle: CSSProperties = useMemo(
      () => ({
        zIndex,
        transform: `translate(${xPos}px,${yPos}px)`,
        pointerEvents: hasPointerEvents ? 'all' : 'none',
        ...style,
      }),
      [zIndex, xPos, yPos, hasPointerEvents, style]
    );

    const grid = useMemo(
      () => (snapToGrid ? snapGrid : [1, 1])! as [number, number],
      [snapToGrid, snapGrid?.[0], snapGrid?.[1]]
    );

    const onMouseEnterHandler = useMemoizedMouseHandler(id, dragging, store.getState, onMouseEnter);
    const onMouseMoveHandler = useMemoizedMouseHandler(id, dragging, store.getState, onMouseMove);
    const onMouseLeaveHandler = useMemoizedMouseHandler(id, dragging, store.getState, onMouseLeave);
    const onContextMenuHandler = useMemoizedMouseHandler(id, false, store.getState, onContextMenu);
    const onNodeDoubleClickHandler = useMemoizedMouseHandler(id, false, store.getState, onNodeDoubleClick);

    const onSelectNodeHandler = useCallback(
      (event: MouseEvent) => {
        if (!isDraggable) {
          if (isSelectable) {
            store.setState({ nodesSelectionActive: false });

            if (!selected) {
              addSelectedNodes([id]);
            }
          }

          if (onClick) {
            const node = store.getState().nodeInternals.get(id)!;
            onClick(event, { ...node });
          }
        }
      },
      [isSelectable, selected, isDraggable, onClick, id]
    );

    const onDragStart = useCallback(
      (event: DraggableEvent) => {
        if (selectNodesOnDrag && isSelectable) {
          store.setState({ nodesSelectionActive: false });

          if (!selected) {
            addSelectedNodes([id]);
          }
        } else if (!selectNodesOnDrag && !selected && isSelectable) {
          const { multiSelectionActive } = store.getState();
          if (multiSelectionActive) {
            addSelectedNodes([id]);
          } else {
            unselectNodesAndEdges();
            store.setState({ nodesSelectionActive: false });
          }
        }

        if (onNodeDragStart) {
          const node = store.getState().nodeInternals.get(id)!;
          onNodeDragStart(event as MouseEvent, { ...node });
        }
      },
      [id, selected, selectNodesOnDrag, isSelectable, onNodeDragStart]
    );

    const onDrag = useCallback(
      (event: DraggableEvent, draggableData: DraggableData) => {
        updateNodePosition({ id, dragging: true, diff: { x: draggableData.deltaX, y: draggableData.deltaY } });

        if (onNodeDrag) {
          const node = store.getState().nodeInternals.get(id)!;
          onNodeDrag(event as MouseEvent, {
            ...node,
            dragging: true,
            position: {
              x: node.position.x + draggableData.deltaX,
              y: node.position.y + draggableData.deltaY,
            },
            positionAbsolute: {
              x: (node.positionAbsolute?.x || 0) + draggableData.deltaX,
              y: (node.positionAbsolute?.y || 0) + draggableData.deltaY,
            },
          });
        }
      },
      [id, onNodeDrag]
    );

    const onDragStop = useCallback(
      (event: DraggableEvent) => {
        // onDragStop also gets called when user just clicks on a node.
        // Because of that we set dragging to true inside the onDrag handler and handle the click here
        let node;

        if (onClick || onNodeDragStop) {
          node = store.getState().nodeInternals.get(id)!;
        }

        if (!dragging) {
          if (isSelectable && !selectNodesOnDrag && !selected) {
            addSelectedNodes([id]);
          }

          if (onClick && node) {
            onClick(event as MouseEvent, { ...node });
          }

          return;
        }

        updateNodePosition({
          id,
          dragging: false,
        });

        if (onNodeDragStop && node) {
          onNodeDragStop(event as MouseEvent, { ...node, dragging: false });
        }
      },
      [id, isSelectable, selectNodesOnDrag, onClick, onNodeDragStop, dragging, selected]
    );

    useEffect(() => {
      if (nodeElement.current && !hidden) {
        const currNode = nodeElement.current;
        resizeObserver?.observe(currNode);

        return () => resizeObserver?.unobserve(currNode);
      }
    }, [hidden]);

    useEffect(() => {
      // when the user programmatically changes the source or handle position, we re-initialize the node
      const typeChanged = prevType.current !== type;
      const sourcePosChanged = prevSourcePosition.current !== sourcePosition;
      const targetPosChanged = prevTargetPosition.current !== targetPosition;

      if (nodeElement.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
        if (typeChanged) {
          prevType.current = type;
        }
        if (sourcePosChanged) {
          prevSourcePosition.current = sourcePosition;
        }
        if (targetPosChanged) {
          prevTargetPosition.current = targetPosition;
        }
        updateNodeDimensions([{ id, nodeElement: nodeElement.current, forceUpdate: true }]);
      }
    }, [id, type, sourcePosition, targetPosition]);

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
