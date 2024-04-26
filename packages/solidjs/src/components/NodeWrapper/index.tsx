// import { type MouseEvent, type KeyboardEvent } from 'react';
import cc from 'classcat';
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
import { Show, JSX, createEffect } from 'solid-js';
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
  const { node, internals, isParent } = useStore((s) => {
    const node = () => s.nodeLookup.get(p.id)! as InternalNode<NodeType>;
    const isParent = () => s.parentLookup.has(p.id);

    return {
      node,
      internals: () => node().internals,
      isParent,
    };
  });

  const initialNodeType = () => node().type || 'default';
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
    if (NodeComponent() === undefined) {
      nt = 'default';
    }
    return nt;
  };

  // if (NodeComponent === undefined) {
  //   p.onError?.('003', errorMessages['error003'](nodeType));
  //   nodeType = 'default';
  //   NodeComponent = builtinNodeTypes.default;
  // }

  const isDraggable = () => !!(node().draggable || (p.nodesDraggable && typeof node().draggable === 'undefined'));
  const isSelectable = () =>
    !!(node().selectable || (p.elementsSelectable && typeof node().selectable === 'undefined'));
  const isConnectable = () =>
    !!(node().connectable || (p.nodesConnectable && typeof node().connectable === 'undefined'));
  const isFocusable = () => !!(node().focusable || (p.nodesFocusable && typeof node().focusable === 'undefined'));

  const store = useStoreApi();
  const hasDimensions = () => nodeHasDimensions(node());
  const nodeRef = useNodeObserver({ node, nodeType, hasDimensions, resizeObserver: () => p.resizeObserver });
  const dragging = useDrag({
    nodeRef: () => nodeRef.current ?? undefined,
    disabled: () => node().hidden || !isDraggable(),
    noDragClassName: () => p.noDragClassName,
    handleSelector: () => node().dragHandle,
    nodeId: () => p.id,
    isSelectable,
  });
  const moveSelectedNodes = useMoveSelectedNodes();

  // if (node.hidden) {
  //   return null;
  // }

  const nodeDimensions = () => getNodeDimensions(node());
  const inlineDimensions = () => getNodeInlineStyleDimensions(node());
  const clampedPosition = () =>
    p.nodeExtent ? clampPosition(internals().positionAbsolute, p.nodeExtent) : internals().positionAbsolute;

  const positionWithOrigin = () =>
    getPositionWithOrigin({
      ...clampedPosition(),
      ...nodeDimensions(),
      origin: node().origin || p.nodeOrigin,
    });
  const hasPointerEvents = () =>
    isSelectable() || isDraggable() || p.onClick || p.onMouseEnter || p.onMouseMove || p.onMouseLeave;

  const onMouseEnterHandler = (e: MouseEvent) => {
    if (p.onMouseEnter) {
      p.onMouseEnter(e, { ...node() });
    }
  };
  // onMouseEnter ? (event: MouseEvent) => onMouseEnter(event, { ...node }) : undefined;
  const onMouseMoveHandler = (e: MouseEvent) => {
    if (p.onMouseMove) {
      p.onMouseMove(e, { ...node() });
    }
  };
  // onMouseMove ? (event: MouseEvent) => onMouseMove(event, { ...node }) : undefined;
  const onMouseLeaveHandler = (e: MouseEvent) => {
    if (p.onMouseLeave) {
      p.onMouseLeave(e, { ...node() });
    }
  };
  // onMouseLeave ? (event: MouseEvent) => onMouseLeave(event, { ...node }) : undefined;
  const onContextMenuHandler = (e: MouseEvent) => {
    if (p.onContextMenu) {
      p.onContextMenu(e, { ...node() });
    }
  };

  // onContextMenu ? (event: MouseEvent) => onContextMenu(event, { ...node }) : undefined;
  const onDoubleClickHandler = (e: MouseEvent) => {
    if (p.onDoubleClick) {
      p.onDoubleClick(e, { ...node() });
    }
  };
  // onDoubleClick ? (event: MouseEvent) => onDoubleClick(event, { ...node }) : undefined;

  const onSelectNodeHandler = (event: MouseEvent) => {
    const { selectNodesOnDrag, nodeDragThreshold } = store;

    if (isSelectable() && (!selectNodesOnDrag.get() || !isDraggable() || nodeDragThreshold.get() > 0)) {
      // this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
      // here we only need to call it when selectNodesOnDrag=false
      handleNodeClick({
        id: p.id,
        store,
        nodeRef: nodeRef.current ?? undefined,
      });
    }

    if (p.onClick) {
      p.onClick(event, { ...node() });
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
    } else if (isDraggable() && node().selected && Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)) {
      const ariaLiveMessage = `Moved selected node ${event.key
        .replace('Arrow', '')
        .toLowerCase()}. New position, x: ${~~clampedPosition().x}, y: ${~~clampedPosition().y}`;

      store.ariaLiveMessage.set(ariaLiveMessage);
      // store.setState({
      //   ariaLiveMessage: `Moved selected node ${event.key
      //     .replace('Arrow', '')
      //     .toLowerCase()}. New position, x: ${~~clampedPosition.x}, y: ${~~clampedPosition.y}`,
      // });

      moveSelectedNodes({
        direction: arrowKeyDiffs[event.key],
        factor: event.shiftKey ? 4 : 1,
      });
    }
  };

  return (
    <Show when={!node().hidden}>
      <div
        class={cc([
          'react-flow__node',
          `react-flow__node-${nodeType()}`,
          {
            // this is overwritable by passing `nopan` as a class name
            [p.noPanClassName]: isDraggable(),
          },
          node().className,
          {
            selected: node().selected,
            selectable: isSelectable(),
            parent: isParent(),
            draggable: isDraggable(),
            dragging: dragging(),
          },
        ])}
        ref={(node) => (nodeRef.current = node)}
        style={{
          'z-index': internals().z,
          transform: `translate(${positionWithOrigin().x}px,${positionWithOrigin().y}px)`,
          'pointer-events': hasPointerEvents() ? 'all' : 'none',
          visibility: hasDimensions() ? 'visible' : 'hidden',
          ...node().style,
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
        aria-label={node().ariaLabel}
      >
        <Provider value={() => p.id}>
          <Dynamic
            component={NodeComponent()}
            id={p.id}
            data={node().data}
            type={nodeType()}
            positionAbsoluteX={clampedPosition().x}
            positionAbsoluteY={clampedPosition().y}
            selected={node().selected}
            isConnectable={isConnectable()}
            sourcePosition={node().sourcePosition}
            targetPosition={node().targetPosition}
            dragging={dragging()}
            dragHandle={node().dragHandle}
            zIndex={internals().z}
            {...nodeDimensions()}
          />
        </Provider>
      </div>
    </Show>
  );
}
