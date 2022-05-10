import React, {
  useEffect,
  useRef,
  memo,
  ComponentType,
  CSSProperties,
  useMemo,
  MouseEvent,
  useCallback,
  useState,
} from 'react';
import cc from 'classcat';
import shallow from 'zustand/shallow';

import { useStore, useStoreApi } from '../../store';
import { Provider } from '../../contexts/NodeIdContext';
import { NodeProps, WrapNodeProps, ReactFlowState } from '../../types';
import useMemoizedMouseHandler from './useMemoizedMouseHandler';
import useDrag, { UseDragEvent, UseDragData } from '../../hooks/useDrag';

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
    resizeObserver,
    dragHandle,
    zIndex,
    isParent,
    noPanClassName,
    noDragClassName,
  }: WrapNodeProps) => {
    const draggingRef = useRef<boolean>(false);
    const [dragging, setDragging] = useState<boolean>(false);
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

    const onMouseEnterHandler = useMemoizedMouseHandler(id, store.getState, onMouseEnter);
    const onMouseMoveHandler = useMemoizedMouseHandler(id, store.getState, onMouseMove);
    const onMouseLeaveHandler = useMemoizedMouseHandler(id, store.getState, onMouseLeave);
    const onContextMenuHandler = useMemoizedMouseHandler(id, store.getState, onContextMenu);
    const onNodeDoubleClickHandler = useMemoizedMouseHandler(id, store.getState, onNodeDoubleClick);

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
      (event: UseDragEvent) => {
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
          onNodeDragStart(event.sourceEvent as MouseEvent, { ...node });
        }
      },
      [id, selected, selectNodesOnDrag, isSelectable, onNodeDragStart]
    );

    const onDrag = useCallback(
      (event: UseDragEvent, dragPos: UseDragData) => {
        updateNodePosition({ id, diff: { x: dragPos.dx, y: dragPos.dy } });
        setDragging(true);
        draggingRef.current = true;

        if (onNodeDrag) {
          const node = store.getState().nodeInternals.get(id)!;
          onNodeDrag(event.sourceEvent as MouseEvent, {
            ...node,
            position: {
              x: node.position.x + dragPos.dx,
              y: node.position.y + dragPos.dy,
            },
            positionAbsolute: {
              x: (node.positionAbsolute?.x || 0) + dragPos.dx,
              y: (node.positionAbsolute?.y || 0) + dragPos.dy,
            },
          });
        }
      },
      [id, onNodeDrag]
    );

    const onDragStop = useCallback(
      (event: UseDragEvent) => {
        let node;

        if (onClick || onNodeDragStop) {
          node = store.getState().nodeInternals.get(id)!;
        }

        if (!draggingRef.current) {
          if (isSelectable && !selectNodesOnDrag && !selected) {
            addSelectedNodes([id]);
          }

          if (onClick && node) {
            onClick(event.sourceEvent as MouseEvent, { ...node });
          }

          return;
        }
        draggingRef.current = false;
        setDragging(false);

        if (onNodeDragStop && node) {
          onNodeDragStop(event.sourceEvent as MouseEvent, { ...node });
        }
      },
      [id, onNodeDragStop, onClick]
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

    useDrag({
      onStart: onDragStart,
      onDrag: onDrag,
      onStop: onDragStop,
      nodeRef: nodeElement,
      disabled: !isDraggable,
      noDragClassName,
      handleSelector: dragHandle,
      nodeId: id,
    });

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
    );
  };

  NodeWrapper.displayName = 'NodeWrapper';

  return memo(NodeWrapper);
};
