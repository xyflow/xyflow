import { useEffect, useRef, type MouseEvent, type KeyboardEvent } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import {
  clampPosition,
  elementSelectionKeys,
  errorMessages,
  getNodeDimensions,
  getPositionWithOrigin,
  isInputDOMNode,
  nodeHasDimensions,
} from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { Provider } from '../../contexts/NodeIdContext';
import { ARIA_NODE_DESC_KEY } from '../A11yDescriptions';
import { useDrag } from '../../hooks/useDrag';
import { useMoveSelectedNodes } from '../../hooks/useMoveSelectedNodes';
import { handleNodeClick } from '../Nodes/utils';
import { arrowKeyDiffs, builtinNodeTypes, getNodeInlineStyleDimensions } from './utils';
import type { InternalNode, Node, NodeWrapperProps } from '../../types';

export function NodeWrapper<NodeType extends Node>({
  id,
  onClick,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  onContextMenu,
  onDoubleClick,
  nodesDraggable,
  elementsSelectable,
  nodesConnectable,
  nodesFocusable,
  resizeObserver,
  noDragClassName,
  noPanClassName,
  disableKeyboardA11y,
  rfId,
  nodeTypes,
  nodeExtent,
  nodeOrigin,
  onError,
}: NodeWrapperProps<NodeType>) {
  const { internalNode, userNode, positionAbsoluteX, positionAbsoluteY, zIndex, isParent, hasHandleBounds } = useStore(
    (s) => {
      const internalNode = s.nodeLookup.get(id)! as InternalNode;

      const positionAbsolute = nodeExtent
        ? clampPosition(internalNode.internals.positionAbsolute, nodeExtent)
        : internalNode.internals.positionAbsolute || { x: 0, y: 0 };

      return {
        internalNode,
        userNode: internalNode.internals.userProvidedNode as NodeType,
        // we are mutating positionAbsolute, z and isParent attributes for sub flows
        // so we we need to force a re-render when some change
        positionAbsoluteX: positionAbsolute.x,
        positionAbsoluteY: positionAbsolute.y,
        zIndex: internalNode.internals.z ?? 0,
        isParent: !!internalNode.internals.isParent,
        hasHandleBounds: !!internalNode.internals.handleBounds,
      };
    },
    shallow
  );

  let nodeType = userNode.type || 'default';
  let NodeComponent = nodeTypes?.[nodeType] || builtinNodeTypes[nodeType];

  if (NodeComponent === undefined) {
    onError?.('003', errorMessages['error003'](nodeType));
    nodeType = 'default';
    NodeComponent = builtinNodeTypes.default;
  }

  const isDraggable = !!(userNode.draggable || (nodesDraggable && typeof userNode.draggable === 'undefined'));
  const isSelectable = !!(userNode.selectable || (elementsSelectable && typeof userNode.selectable === 'undefined'));
  const isConnectable = !!(userNode.connectable || (nodesConnectable && typeof userNode.connectable === 'undefined'));
  const isFocusable = !!(userNode.focusable || (nodesFocusable && typeof userNode.focusable === 'undefined'));

  const store = useStoreApi();
  const nodeRef = useRef<HTMLDivElement>(null);
  const prevSourcePosition = useRef(userNode.sourcePosition);
  const prevTargetPosition = useRef(userNode.targetPosition);
  const prevType = useRef(nodeType);

  const nodeDimensions = getNodeDimensions(internalNode);
  const inlineDimensions = getNodeInlineStyleDimensions(internalNode);
  const initialized = nodeHasDimensions(internalNode);

  const moveSelectedNodes = useMoveSelectedNodes();

  useEffect(() => {
    return () => {
      if (nodeRef.current) {
        resizeObserver?.unobserve(nodeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (nodeRef.current && !userNode.hidden) {
      const currNode = nodeRef.current;

      if (!initialized || !hasHandleBounds) {
        resizeObserver?.unobserve(currNode);
        resizeObserver?.observe(currNode);
      }
    }
  }, [userNode.hidden, initialized, hasHandleBounds]);

  useEffect(() => {
    // when the user programmatically changes the source or handle position, we re-initialize the node
    const typeChanged = prevType.current !== nodeType;
    const sourcePosChanged = prevSourcePosition.current !== userNode.sourcePosition;
    const targetPosChanged = prevTargetPosition.current !== userNode.targetPosition;

    if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
      if (typeChanged) {
        prevType.current = nodeType;
      }
      if (sourcePosChanged) {
        prevSourcePosition.current = userNode.sourcePosition;
      }
      if (targetPosChanged) {
        prevTargetPosition.current = userNode.targetPosition;
      }
      store.getState().updateInternalNodeValues(new Map([[id, { id, nodeElement: nodeRef.current, force: true }]]));
    }
  }, [id, nodeType, userNode.sourcePosition, userNode.targetPosition]);

  const dragging = useDrag({
    nodeRef,
    disabled: userNode.hidden || !isDraggable,
    noDragClassName,
    handleSelector: userNode.dragHandle,
    nodeId: id,
    isSelectable,
  });

  if (userNode.hidden) {
    return null;
  }

  const positionAbsoluteOrigin = getPositionWithOrigin({
    x: positionAbsoluteX,
    y: positionAbsoluteY,
    ...nodeDimensions,
    origin: userNode.origin || nodeOrigin,
  });

  const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;

  const onMouseEnterHandler = onMouseEnter ? (event: MouseEvent) => onMouseEnter(event, { ...userNode }) : undefined;
  const onMouseMoveHandler = onMouseMove ? (event: MouseEvent) => onMouseMove(event, { ...userNode }) : undefined;
  const onMouseLeaveHandler = onMouseLeave ? (event: MouseEvent) => onMouseLeave(event, { ...userNode }) : undefined;
  const onContextMenuHandler = onContextMenu ? (event: MouseEvent) => onContextMenu(event, { ...userNode }) : undefined;
  const onDoubleClickHandler = onDoubleClick ? (event: MouseEvent) => onDoubleClick(event, { ...userNode }) : undefined;

  const onSelectNodeHandler = (event: MouseEvent) => {
    const { selectNodesOnDrag, nodeDragThreshold } = store.getState();

    if (isSelectable && (!selectNodesOnDrag || !isDraggable || nodeDragThreshold > 0)) {
      // this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
      // here we only need to call it when selectNodesOnDrag=false
      handleNodeClick({
        id,
        store,
        nodeRef,
      });
    }

    if (onClick) {
      onClick(event, { ...userNode });
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (isInputDOMNode(event.nativeEvent) || disableKeyboardA11y) {
      return;
    }

    if (elementSelectionKeys.includes(event.key) && isSelectable) {
      const unselect = event.key === 'Escape';

      handleNodeClick({
        id,
        store,
        unselect,
        nodeRef,
      });
    } else if (isDraggable && userNode.selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      store.setState({
        ariaLiveMessage: `Moved selected node ${event.key
          .replace('Arrow', '')
          .toLowerCase()}. New position, x: ${~~positionAbsoluteX}, y: ${~~positionAbsoluteY}`,
      });

      moveSelectedNodes({
        direction: arrowKeyDiffs[event.key],
        factor: event.shiftKey ? 4 : 1,
      });
    }
  };

  return (
    <div
      className={cc([
        'react-flow__node',
        `react-flow__node-${nodeType}`,
        {
          // this is overwritable by passing `nopan` as a class name
          [noPanClassName]: isDraggable,
        },
        userNode.className,
        {
          selected: userNode.selected,
          selectable: isSelectable,
          parent: isParent,
          draggable: isDraggable,
          dragging,
        },
      ])}
      ref={nodeRef}
      style={{
        zIndex,
        transform: `translate(${positionAbsoluteOrigin.x}px,${positionAbsoluteOrigin.y}px)`,
        pointerEvents: hasPointerEvents ? 'all' : 'none',
        visibility: initialized ? 'visible' : 'hidden',
        ...userNode.style,
        ...inlineDimensions,
      }}
      data-id={id}
      data-testid={`rf__node-${id}`}
      onMouseEnter={onMouseEnterHandler}
      onMouseMove={onMouseMoveHandler}
      onMouseLeave={onMouseLeaveHandler}
      onContextMenu={onContextMenuHandler}
      onClick={onSelectNodeHandler}
      onDoubleClick={onDoubleClickHandler}
      onKeyDown={isFocusable ? onKeyDown : undefined}
      tabIndex={isFocusable ? 0 : undefined}
      role={isFocusable ? 'button' : undefined}
      aria-describedby={disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`}
      aria-label={userNode.ariaLabel}
    >
      <Provider value={id}>
        <NodeComponent
          id={id}
          data={userNode.data}
          type={nodeType}
          positionAbsoluteX={positionAbsoluteX}
          positionAbsoluteY={positionAbsoluteY}
          selected={userNode.selected}
          isConnectable={isConnectable}
          sourcePosition={userNode.sourcePosition}
          targetPosition={userNode.targetPosition}
          dragging={dragging}
          dragHandle={userNode.dragHandle}
          zIndex={zIndex}
          {...nodeDimensions}
        />
      </Provider>
    </div>
  );
}
