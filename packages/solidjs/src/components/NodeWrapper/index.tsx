// import { type MouseEvent, type KeyboardEvent } from 'react';
import cc from 'classcat';
import {
  elementSelectionKeys,
  errorMessages,
  getNodeDimensions,
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
import { Show, JSX, onMount, createRenderEffect, createEffect, createSignal, on } from 'solid-js';
import { Dynamic } from 'solid-js/web';

export function NodeWrapper<NodeType extends Node>(p: NodeWrapperProps<NodeType>): JSX.Element {
  //   id,
  //   onClick,
  //   onMouseEnter,
  //   onMouseMove,
  //   onMouseLeave,
  //   onContextMenu,
  //   onDoubleClick,
  //   nodesDraggable,
  //   elementsSelectable,
  //   nodesConnectable,
  //   nodesFocusable,
  //   resizeObserver,
  //   noDragClassName,
  //   noPanClassName,
  //   disableKeyboardA11y,
  //   rfId,
  //   nodeTypes,
  //   nodeExtent,
  //   nodeOrigin,
  //   onError,
  // }: NodeWrapperProps<NodeType>) {
  const store = useStoreApi();
  const nodeData = useStore((s) => {
    const node = () => s.nodeLookup.get(p.id)! as InternalNode<NodeType>;
    const isParent = () => s.parentLookup.has(p.id);

    return {
      node,
      internals: () => node().internals,
      isParent,
    };
  });

  const initialNodeType = () => nodeData.node()?.type || 'default';
  const initialNodeComponent = () => p.nodeTypes?.[initialNodeType()] || builtinNodeTypes[initialNodeType()];

  const NodeComponent = () => {
    const comp = initialNodeComponent();
    if (comp === undefined) {
      p.onError?.('003', errorMessages['error003'](initialNodeType()));
      return builtinNodeTypes.default;
    }
    return comp;
  };

  const nodeType = () => {
    let nt = initialNodeType();
    if (initialNodeComponent() === undefined) {
      nt = 'default';
    }
    return nt;
  };

  // if (NodeComponent === undefined) {
  //   p.onError?.('003', errorMessages['error003'](nodeType));
  //   nodeType = 'default';
  //   NodeComponent = builtinNodeTypes.default;
  // }

  const isDraggable = () =>
    !!(nodeData.node()?.draggable || (p.nodesDraggable && typeof nodeData.node()?.draggable === 'undefined'));
  const isSelectable = () =>
    !!(nodeData.node()?.selectable || (p.elementsSelectable && typeof nodeData.node()?.selectable === 'undefined'));
  const isConnectable = () =>
    !!(nodeData.node()?.connectable || (p.nodesConnectable && typeof nodeData.node()?.connectable === 'undefined'));
  const isFocusable = () =>
    !!(nodeData.node()?.focusable || (p.nodesFocusable && typeof nodeData.node()?.focusable === 'undefined'));

  const hasDimensions = () => nodeHasDimensions(nodeData.node());
  const nodeRef = useNodeObserver({
    node: nodeData.node,
    nodeType,
    hasDimensions,
    resizeObserver: () => p.resizeObserver,
  });
  const dragging = useDrag({
    nodeRef: () => nodeRef.current ?? undefined,
    disabled: () => nodeData.node()?.hidden || !isDraggable(),
    noDragClassName: () => p.noDragClassName,
    handleSelector: () => nodeData.node()?.dragHandle,
    nodeId: () => p.id,
    isSelectable,
    nodeClickDistance: () => p.nodeClickDistance,
  });
  const moveSelectedNodes = useMoveSelectedNodes();

  // if (node.hidden) {
  //   return null;
  // }

  const nodeDimensions = () => getNodeDimensions(nodeData.node());
  const inlineDimensions = () => getNodeInlineStyleDimensions(nodeData.node());

  const hasPointerEvents = () =>
    isSelectable() || isDraggable() || p.onClick || p.onMouseEnter || p.onMouseMove || p.onMouseLeave;

  const onMouseEnterHandler = (e: MouseEvent) => {
    if (p.onMouseEnter) {
      p.onMouseEnter(e, { ...nodeData.internals()?.userNode });
    }
  };
  // onMouseEnter ? (event: MouseEvent) => onMouseEnter(event, { ...node }) : undefined;
  const onMouseMoveHandler = (e: MouseEvent) => {
    if (p.onMouseMove) {
      p.onMouseMove(e, { ...nodeData.internals()?.userNode });
    }
  };
  // onMouseMove ? (event: MouseEvent) => onMouseMove(event, { ...node }) : undefined;
  const onMouseLeaveHandler = (e: MouseEvent) => {
    if (p.onMouseLeave) {
      p.onMouseLeave(e, { ...nodeData.internals()?.userNode });
    }
  };
  // onMouseLeave ? (event: MouseEvent) => onMouseLeave(event, { ...node }) : undefined;
  const onContextMenuHandler = (e: MouseEvent) => {
    if (p.onContextMenu) {
      p.onContextMenu(e, { ...nodeData.internals()?.userNode });
    }
  };

  // onContextMenu ? (event: MouseEvent) => onContextMenu(event, { ...node }) : undefined;
  const onDoubleClickHandler = (e: MouseEvent) => {
    if (p.onDoubleClick) {
      p.onDoubleClick(e, { ...nodeData.internals()?.userNode });
    }
  };
  // onDoubleClick ? (event: MouseEvent) => onDoubleClick(event, { ...node }) : undefined;

  const onSelectNodeHandler = (event: MouseEvent) => {
    if (isSelectable() && (!store.selectNodesOnDrag.get() || !isDraggable() || store.nodeDragThreshold.get() > 0)) {
      /*
       * this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
       * here we only need to call it when selectNodesOnDrag=false
       */
      handleNodeClick({
        id: p.id,
        store,
        nodeRef: nodeRef.current ?? undefined,
      });
    }

    if (p.onClick) {
      p.onClick(event, { ...nodeData.internals()?.userNode });
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (isInputDOMNode(event) || p.disableKeyboardA11y) {
      return;
    }

    if (elementSelectionKeys.includes(event.key) && isSelectable()) {
      const unselect = event.key === 'Escape';

      handleNodeClick({
        id: p.id,
        store,
        unselect,
        nodeRef: nodeRef.current ?? undefined,
      });
    } else if (
      isDraggable() &&
      nodeData.node()?.selected &&
      Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)
    ) {
      // prevent default scrolling behavior on arrow key press when node is moved
      event.preventDefault();

      const ariaLiveMessage = `Moved selected node ${event.key
        .replace('Arrow', '')
        .toLowerCase()}. New position, x: ${~~nodeData.internals()?.positionAbsolute.x}, y: ${~~nodeData.internals()
        ?.positionAbsolute.y}`;

      store.ariaLiveMessage.set(ariaLiveMessage);

      moveSelectedNodes({
        direction: arrowKeyDiffs[event.key],
        factor: event.shiftKey ? 4 : 1,
      });
    }
  };

  return (
    <div
      class={cc([
        'react-flow__node',
        `react-flow__node-${nodeType()}`,
        {
          // this is overwritable by passing `nopan` as a class name
          [p.noPanClassName]: isDraggable(),
        },
        nodeData.node()?.className,
        {
          selected: nodeData.node()?.selected,
          selectable: isSelectable(),
          parent: nodeData.isParent(),
          draggable: isDraggable(),
          dragging: dragging(),
        },
      ])}
      ref={(node) => (nodeRef.current = node)}
      style={{
        'z-index': nodeData.internals()?.z,
        transform: `translate(${nodeData.internals()?.positionAbsolute.x}px,${
          nodeData.internals()?.positionAbsolute.y
        }px)`,
        'pointer-events': hasPointerEvents() ? 'all' : 'none',
        visibility: hasDimensions() ? 'visible' : 'hidden',
        display: nodeData.node()?.hidden ? 'none' : 'block',
        ...nodeData.node()?.style,
        ...inlineDimensions(),
      }}
      data-id={p.id}
      data-testid={`rf__node-${p.id}`}
      onMouseEnter={onMouseEnterHandler}
      onMouseMove={onMouseMoveHandler}
      onMouseLeave={onMouseLeaveHandler}
      onContextMenu={onContextMenuHandler}
      onClick={onSelectNodeHandler}
      onDblClick={onDoubleClickHandler}
      onKeyDown={isFocusable() ? onKeyDown : undefined}
      tabIndex={isFocusable() ? 0 : undefined}
      role={isFocusable() ? 'button' : undefined}
      aria-describedby={p.disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${p.rfId}`}
      aria-label={nodeData.node()?.ariaLabel}
    >
      <Provider value={() => p.id}>
        <Dynamic
          component={NodeComponent()}
          id={p.id}
          data={nodeData.node()?.data}
          type={nodeType()}
          positionAbsoluteX={nodeData.internals()?.positionAbsolute.x}
          positionAbsoluteY={nodeData.internals()?.positionAbsolute.y}
          selected={nodeData.node()?.selected ?? false}
          selectable={isSelectable()}
          draggable={isDraggable()}
          deletable={nodeData.node()?.deletable ?? true}
          isConnectable={isConnectable()}
          sourcePosition={nodeData.node()?.sourcePosition}
          targetPosition={nodeData.node()?.targetPosition}
          dragging={dragging()}
          dragHandle={nodeData.node()?.dragHandle}
          zIndex={nodeData.internals()?.z}
          parentId={nodeData.node()?.parentId}
          {...nodeDimensions()}
        />
      </Provider>
    </div>
  );
}
