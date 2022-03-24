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

const stopSelectionPropagation: EventListener = (event) => {
  event.stopImmediatePropagation();
};

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

    // execution order of events and their tasks:
    // mouse down: handle selection related logics ->
    // drag start: call onNodeDragStart() ->
    // mouse move: nothing ->
    // drag: update node position with dragging status set to true and call onNodeDrag() ->
    // mouse up: nothing ->
    // drag stop: update node position with drag status set to false and call onNodeDragStop() ->
    // click: call onClick()

    // on mouse down handler
    // @TODO: should we change noDragClassName to noSelectClassName?
    // because select and drag are two different actions
    const onMouseDownHandler = useCallback(
      (event: globalThis.MouseEvent) => {
        console.log(event.target);
        // handle selection related behaviors
        if (isSelectable && !(event.currentTarget as Element).classList.contains(noDragClassName)) {
          // deactive drag selection mode (drag selection cannot start from a node)
          if (selectNodesOnDrag) {
            store.setState({ nodesSelectionActive: false });
          }
          // deselect other nodes if multiselection is not active
          // a little complicated here
          // because we don't have the proper action to do this
          const { multiSelectionActive } = store.getState();
          if (!multiSelectionActive) {
            // deselect all
            unselectNodesAndEdges();
            // if this node is already selected
            // reselect it becasue we just deselected all
            if (selected) {
              addSelectedNodes([id]);
            }
          }
          // select this node if it's not already selected
          if (!selected) {
            addSelectedNodes([id]);
          }
        }
      },
      [isSelectable, noDragClassName, selectNodesOnDrag, selected, id]
    );

    // on click handler
    const onClickNodeHandler = useCallback(
      (event: MouseEvent) => {
        // if there's a corresponding onClick handler, execute it
        if (onClick) {
          const node = store.getState().nodeInternals.get(id)!;
          onClick(event, { ...node });
        }
      },
      [onClick, id]
    );

    // on drag start handler
    const onDragStart = useCallback(
      (event: DraggableEvent) => {
        // if there's a corresponding onNodeDragStart handler, execute it
        if (onNodeDragStart) {
          const node = store.getState().nodeInternals.get(id)!;
          onNodeDragStart(event as MouseEvent, { ...node });
        }
      },
      [onNodeDragStart, id]
    );

    // on drag handler
    const onDrag = useCallback(
      (event: DraggableEvent, draggableData: DraggableData) => {
        // update node position
        updateNodePosition({ id, dragging: true, diff: { x: draggableData.deltaX, y: draggableData.deltaY } });
        // if there's a corresponding onNodeDrag handler, execute it
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
      [onNodeDrag, id]
    );

    // on drag stop handler, will get triggered by click
    // but click is already handled in onClickNodeHandler
    // so we don't need to handle it in this handler
    const onDragStop = useCallback(
      (event: DraggableEvent) => {
        // update node position
        updateNodePosition({
          id,
          dragging: false,
        });
        // if there's a corresponding onNodeDragStop handler, execute it
        if (onNodeDragStop) {
          const node = store.getState().nodeInternals.get(id)!;
          onNodeDragStop(event as MouseEvent, { ...node, dragging: false });
        }
      },
      [onNodeDragStop, id]
    );

    // mouse down triggered selection is handled in the node div
    // stop immediate propagation will prevent elements with noselection classname from triggering selection
    // @TODO: should we change noDragClassName to noSelectClassName?
    // because select and drag are two different actions
    useEffect(() => {
      if (nodeElement.current) {
        const currNode = nodeElement.current;
        const noSelectionElements = currNode.getElementsByClassName(noDragClassName);
        // sometimes the child elements get rendered later and can't be got here
        // best practice would still be adding a stopimmediatepropagation of mousedown, or a hook api
        // in one's own code, instead of using "noselection" classnames
        // @TODO: better api design
        for (let ind = 0; ind < noSelectionElements.length; ++ind) {
          noSelectionElements[ind].addEventListener('mousedown', stopSelectionPropagation);
        }
        return () => {
          for (let ind = 0; ind < noSelectionElements.length; ++ind) {
            noSelectionElements[ind].removeEventListener('mousedown', stopSelectionPropagation);
          }
        };
      }
    }, [noDragClassName]);

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
        // we cannot set onMouseDown on the <div>
        // because it will be overriden by what is defined here
        onMouseDown={onMouseDownHandler}
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
          onClick={onClickNodeHandler}
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
