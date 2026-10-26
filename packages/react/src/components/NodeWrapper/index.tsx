import { type MouseEvent, type KeyboardEvent, memo } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import {
  elementSelectionKeys,
  errorMessages,
  getNodeDimensions,
  isInputDOMNode,
  nodeHasDimensions,
  getNodesInside,
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

function NodeWrapper<NodeType extends Node>({
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
  nodeClickDistance,
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
    NodeComponent = nodeTypes?.['default'] || builtinNodeTypes.default;
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
    nodeClickDistance,
  });
  const moveSelectedNodes = useMoveSelectedNodes();

  if (node.hidden) {
    return null;
  }

  const nodeDimensions = getNodeDimensions(node);
  const inlineDimensions = getNodeInlineStyleDimensions(node);

  const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;

  const onMouseEnterHandler = onMouseEnter
    ? (event: MouseEvent) => onMouseEnter(event, { ...internals.userNode })
    : undefined;
  const onMouseMoveHandler = onMouseMove
    ? (event: MouseEvent) => onMouseMove(event, { ...internals.userNode })
    : undefined;
  const onMouseLeaveHandler = onMouseLeave
    ? (event: MouseEvent) => onMouseLeave(event, { ...internals.userNode })
    : undefined;
  const onContextMenuHandler = onContextMenu
    ? (event: MouseEvent) => onContextMenu(event, { ...internals.userNode })
    : undefined;
  const onDoubleClickHandler = onDoubleClick
    ? (event: MouseEvent) => onDoubleClick(event, { ...internals.userNode })
    : undefined;

  const onSelectNodeHandler = (event: MouseEvent) => {
    const { selectNodesOnDrag, nodeDragThreshold } = store.getState();

    if (isSelectable && (!selectNodesOnDrag || !isDraggable || nodeDragThreshold > 0)) {
      /*
       * this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
       * here we only need to call it when selectNodesOnDrag=false
       */
      handleNodeClick({
        id,
        store,
        nodeRef,
      });
    }

    if (onClick) {
      onClick(event, { ...internals.userNode });
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
      // prevent default scrolling behavior on arrow key press when node is moved
      event.preventDefault();

      const { ariaLabelConfig } = store.getState();

      store.setState({
        ariaLiveMessage: ariaLabelConfig['node.a11yDescription.ariaLiveMessage']({
          direction: event.key.replace('Arrow', '').toLowerCase(),
          x: ~~internals.positionAbsolute.x,
          y: ~~internals.positionAbsolute.y,
        }),
      });

      moveSelectedNodes({
        direction: arrowKeyDiffs[event.key],
        factor: event.shiftKey ? 4 : 1,
      });
    }
  };

  const onFocus = () => {
    if (disableKeyboardA11y || !nodeRef.current?.matches(':focus-visible')) {
      return;
    }

    const { transform, width, height, autoPanOnNodeFocus, setCenter } = store.getState();

    if (!autoPanOnNodeFocus) {
      return;
    }

    const withinViewport =
      getNodesInside(new Map([[id, node]]), { x: 0, y: 0, width, height }, transform, true).length > 0;

    if (!withinViewport) {
      setCenter(node.position.x + nodeDimensions.width / 2, node.position.y + nodeDimensions.height / 2, {
        zoom: transform[2],
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
        transform: `translate(${internals.positionAbsolute.x}px,${internals.positionAbsolute.y}px)`,
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
      onFocus={isFocusable ? onFocus : undefined}
      role={node.ariaRole ?? (isFocusable ? 'group' : undefined)}
      aria-roledescription="node"
      aria-describedby={disableKeyboardA11y ? undefined : `${ARIA_NODE_DESC_KEY}-${rfId}`}
      aria-label={node.ariaLabel}
      {...node.domAttributes}
    >
      <Provider value={id}>
        <NodeComponent
          id={id}
          data={node.data}
          type={nodeType}
          positionAbsoluteX={internals.positionAbsolute.x}
          positionAbsoluteY={internals.positionAbsolute.y}
          selected={node.selected ?? false}
          selectable={isSelectable}
          draggable={isDraggable}
          deletable={node.deletable ?? true}
          isConnectable={isConnectable}
          sourcePosition={node.sourcePosition}
          targetPosition={node.targetPosition}
          dragging={dragging}
          dragHandle={node.dragHandle}
          zIndex={internals.z}
          parentId={node.parentId}
          {...nodeDimensions}
        />
      </Provider>
    </div>
  );
}

export default memo(NodeWrapper) as typeof NodeWrapper;
