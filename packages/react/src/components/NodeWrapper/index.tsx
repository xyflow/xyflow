import { useEffect, useRef, type MouseEvent, type KeyboardEvent } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import {
  clampPosition,
  elementSelectionKeys,
  errorMessages,
  getNodeDimensions,
  getPositionWithOrigin,
  internalsSymbol,
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
import type { Node, NodeWrapperProps } from '../../types';

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
  const { node, positionAbsoluteX, positionAbsoluteY, zIndex, isParent } = useStore((s) => {
    const node = s.nodeLookup.get(id)! as NodeType;

    const positionAbsolute = nodeExtent
      ? clampPosition(node.computed?.positionAbsolute, nodeExtent)
      : node.computed?.positionAbsolute || { x: 0, y: 0 };

    return {
      node,
      // we are mutating positionAbsolute, z and isParent attributes for sub flows
      // so we we need to force a re-render when some change
      positionAbsoluteX: positionAbsolute.x,
      positionAbsoluteY: positionAbsolute.y,
      zIndex: node[internalsSymbol]?.z ?? 0,
      isParent: !!node[internalsSymbol]?.isParent,
    };
  }, shallow);

  let nodeType = node.type || 'default';
  let NodeComponent = nodeTypes?.[nodeType] || builtinNodeTypes[nodeType];

  if (NodeComponent === undefined) {
    onError?.('003', errorMessages['error003'](nodeType));
    nodeType = 'default';
    NodeComponent = builtinNodeTypes.default;
  }

  const isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
  const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
  const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
  const isFocusable = !!(node.focusable || (nodesFocusable && typeof node.focusable === 'undefined'));

  const store = useStoreApi();
  const nodeRef = useRef<HTMLDivElement>(null);
  const prevSourcePosition = useRef(node.sourcePosition);
  const prevTargetPosition = useRef(node.targetPosition);
  const prevType = useRef(nodeType);

  const nodeDimensions = getNodeDimensions(node);
  const inlineDimensions = getNodeInlineStyleDimensions(node);
  const initialized = nodeHasDimensions(node);
  const hasHandleBounds = !!node[internalsSymbol]?.handleBounds;

  const moveSelectedNodes = useMoveSelectedNodes();

  useEffect(() => {
    return () => {
      if (nodeRef.current) {
        resizeObserver?.unobserve(nodeRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (nodeRef.current && !node.hidden) {
      const currNode = nodeRef.current;

      if (!initialized || !hasHandleBounds) {
        resizeObserver?.unobserve(currNode);
        resizeObserver?.observe(currNode);
      }
    }
  }, [node.hidden, initialized, hasHandleBounds]);

  useEffect(() => {
    // when the user programmatically changes the source or handle position, we re-initialize the node
    const typeChanged = prevType.current !== nodeType;
    const sourcePosChanged = prevSourcePosition.current !== node.sourcePosition;
    const targetPosChanged = prevTargetPosition.current !== node.targetPosition;

    if (nodeRef.current && (typeChanged || sourcePosChanged || targetPosChanged)) {
      if (typeChanged) {
        prevType.current = nodeType;
      }
      if (sourcePosChanged) {
        prevSourcePosition.current = node.sourcePosition;
      }
      if (targetPosChanged) {
        prevTargetPosition.current = node.targetPosition;
      }
      store.getState().updateNodeDimensions(new Map([[id, { id, nodeElement: nodeRef.current, forceUpdate: true }]]));
    }
  }, [id, nodeType, node.sourcePosition, node.targetPosition]);

  const dragging = useDrag({
    nodeRef,
    disabled: node.hidden || !isDraggable,
    noDragClassName,
    handleSelector: node.dragHandle,
    nodeId: id,
    isSelectable,
  });

  if (node.hidden) {
    return null;
  }

  const positionAbsoluteOrigin = getPositionWithOrigin({
    x: positionAbsoluteX,
    y: positionAbsoluteY,
    ...nodeDimensions,
    origin: node.origin || nodeOrigin,
  });
  const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;

  const onMouseEnterHandler = onMouseEnter ? (event: MouseEvent) => onMouseEnter(event, { ...node }) : undefined;
  const onMouseMoveHandler = onMouseMove ? (event: MouseEvent) => onMouseMove(event, { ...node }) : undefined;
  const onMouseLeaveHandler = onMouseLeave ? (event: MouseEvent) => onMouseLeave(event, { ...node }) : undefined;
  const onContextMenuHandler = onContextMenu ? (event: MouseEvent) => onContextMenu(event, { ...node }) : undefined;
  const onDoubleClickHandler = onDoubleClick ? (event: MouseEvent) => onDoubleClick(event, { ...node }) : undefined;

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
      onClick(event, { ...node });
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
    } else if (isDraggable && node.selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
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
        node.className,
        {
          selected: node.selected,
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
        ...node.style,
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
      aria-label={node.ariaLabel}
    >
      <Provider value={id}>
        <NodeComponent
          id={id}
          data={node.data}
          type={nodeType}
          positionAbsoluteX={positionAbsoluteX}
          positionAbsoluteY={positionAbsoluteY}
          selected={node.selected}
          isConnectable={isConnectable}
          sourcePosition={node.sourcePosition}
          targetPosition={node.targetPosition}
          dragging={dragging}
          dragHandle={node.dragHandle}
          zIndex={zIndex}
          {...nodeDimensions}
        />
      </Provider>
    </div>
  );
}
