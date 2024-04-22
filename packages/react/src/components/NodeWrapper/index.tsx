import { type MouseEvent, type KeyboardEvent } from 'react';
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
import { useNodeObserver } from './useNodeObserver';
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
  const { node, internals, isParent } = useStore((s) => {
    const node = s.nodeLookup.get(id)! as InternalNode<NodeType>;
    const isParent = s.parentLookup.has(id);

    return {
      node,
      internals: node.internals,
      isParent,
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
  const hasDimensions = nodeHasDimensions(node);
  const nodeRef = useNodeObserver({ node, nodeType, hasDimensions, resizeObserver });
  const dragging = useDrag({
    nodeRef,
    disabled: node.hidden || !isDraggable,
    noDragClassName,
    handleSelector: node.dragHandle,
    nodeId: id,
    isSelectable,
  });
  const moveSelectedNodes = useMoveSelectedNodes();

  if (node.hidden) {
    return null;
  }

  const nodeDimensions = getNodeDimensions(node);
  const inlineDimensions = getNodeInlineStyleDimensions(node);
  const clampedPosition = nodeExtent
    ? clampPosition(internals.positionAbsolute, nodeExtent)
    : internals.positionAbsolute;

  const positionWithOrigin = getPositionWithOrigin({
    ...clampedPosition,
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
          .toLowerCase()}. New position, x: ${~~clampedPosition.x}, y: ${~~clampedPosition.y}`,
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
        zIndex: internals.z,
        transform: `translate(${positionWithOrigin.x}px,${positionWithOrigin.y}px)`,
        pointerEvents: hasPointerEvents ? 'all' : 'none',
        visibility: hasDimensions ? 'visible' : 'hidden',
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
          positionAbsoluteX={clampedPosition.x}
          positionAbsoluteY={clampedPosition.y}
          selected={node.selected}
          isConnectable={isConnectable}
          sourcePosition={node.sourcePosition}
          targetPosition={node.targetPosition}
          dragging={dragging}
          dragHandle={node.dragHandle}
          zIndex={internals.z}
          {...nodeDimensions}
        />
      </Provider>
    </div>
  );
}
