import { useEffect, useRef, memo, ComponentType, MouseEvent, KeyboardEvent } from 'react';
import cc from 'classcat';

import { useStoreApi } from '../../hooks/useStore';
import { Provider } from '../../contexts/NodeIdContext';
import { ARIA_NODE_DESC_KEY } from '../A11yDescriptions';
import useDrag from '../../hooks/useDrag';
import useUpdateNodePositions from '../../hooks/useUpdateNodePositions';
import { getMouseHandler, handleNodeClick } from './utils';
import { NodeProps, WrapNodeProps, XYPosition } from '../../types';
import { elementSelectionKeys } from '../../utils';

export const arrowKeyDiffs: Record<string, XYPosition> = {
  ArrowUp: { x: 0, y: -10 },
  ArrowDown: { x: 0, y: 10 },
  ArrowLeft: { x: -10, y: 0 },
  ArrowRight: { x: 10, y: 0 },
};

export default (NodeComponent: ComponentType<NodeProps>) => {
  const NodeWrapper = ({
    id,
    type,
    data,
    xPos,
    yPos,
    xPosOrigin,
    yPosOrigin,
    selected,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
    onContextMenu,
    onDoubleClick,
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
    initialized,
    disableKeyboardA11y,
    ariaLabel,
    rfId,
  }: WrapNodeProps) => {
    const store = useStoreApi();
    const nodeRef = useRef<HTMLDivElement>(null);
    const prevSourcePosition = useRef(sourcePosition);
    const prevTargetPosition = useRef(targetPosition);
    const prevType = useRef(type);
    const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;
    const updatePositions = useUpdateNodePositions();

    const onMouseEnterHandler = getMouseHandler(id, store.getState, onMouseEnter);
    const onMouseMoveHandler = getMouseHandler(id, store.getState, onMouseMove);
    const onMouseLeaveHandler = getMouseHandler(id, store.getState, onMouseLeave);
    const onContextMenuHandler = getMouseHandler(id, store.getState, onContextMenu);
    const onDoubleClickHandler = getMouseHandler(id, store.getState, onDoubleClick);
    const onSelectNodeHandler = (event: MouseEvent) => {
      if (isSelectable && (!selectNodesOnDrag || !isDraggable)) {
        // this handler gets called within the drag start event when selectNodesOnDrag=true
        handleNodeClick({
          id,
          store,
        });
      }

      if (onClick) {
        const node = store.getState().nodeInternals.get(id)!;
        onClick(event, { ...node });
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (elementSelectionKeys.includes(event.key) && isSelectable) {
        const unselect = event.key === 'Escape';
        if (unselect) {
          nodeRef.current?.blur();
        }
        handleNodeClick({
          id,
          store,
          unselect,
        });
      } else if (selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
        store.setState({
          ariaLiveMessage: `Moved selected node ten pixels ${event.key
            .replace('Arrow', '')
            .toLowerCase()}. New position, x: ${~~xPos}, y: ${~~yPos}`,
        });

        updatePositions(arrowKeyDiffs[event.key]);
      }
    };

    useEffect(() => {
      if (nodeRef.current && !hidden) {
        const currNode = nodeRef.current;
        resizeObserver?.observe(currNode);

        return () => resizeObserver?.unobserve(currNode);
      }
    }, [hidden]);

    useEffect(() => {
      // when the user programmatically changes the source or handle position, we re-initialize the node
      const typeChanged = prevType.current !== type;
      const sourcePosChanged = prevSourcePosition.current !== sourcePosition;
      const targetPosChanged = prevTargetPosition.current !== targetPosition;

      if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
        if (typeChanged) {
          prevType.current = type;
        }
        if (sourcePosChanged) {
          prevSourcePosition.current = sourcePosition;
        }
        if (targetPosChanged) {
          prevTargetPosition.current = targetPosition;
        }
        store.getState().updateNodeDimensions([{ id, nodeElement: nodeRef.current, forceUpdate: true }]);
      }
    }, [id, type, sourcePosition, targetPosition]);

    const dragging = useDrag({
      nodeRef,
      disabled: hidden || !isDraggable,
      noDragClassName,
      handleSelector: dragHandle,
      nodeId: id,
      isSelectable,
      selectNodesOnDrag,
    });

    if (hidden) {
      return null;
    }

    return (
      <div
        className={cc([
          'react-flow__node',
          `react-flow__node-${type}`,
          noPanClassName,
          className,
          {
            selected,
            selectable: isSelectable,
            parent: isParent,
            dragging,
          },
        ])}
        ref={nodeRef}
        style={{
          zIndex,
          transform: `translate(${xPosOrigin}px,${yPosOrigin}px)`,
          pointerEvents: hasPointerEvents ? 'all' : 'none',
          visibility: initialized ? 'visible' : 'hidden',
          ...style,
        }}
        data-id={id}
        onMouseEnter={onMouseEnterHandler}
        onMouseMove={onMouseMoveHandler}
        onMouseLeave={onMouseLeaveHandler}
        onContextMenu={onContextMenuHandler}
        onClick={onSelectNodeHandler}
        onDoubleClick={onDoubleClickHandler}
        onKeyDown={disableKeyboardA11y ? undefined : onKeyDown}
        tabIndex={disableKeyboardA11y ? undefined : 0}
        role={disableKeyboardA11y ? undefined : 'button'}
        aria-describedby={disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`}
        aria-label={ariaLabel}
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
