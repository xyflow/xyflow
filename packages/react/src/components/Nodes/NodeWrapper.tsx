import { useEffect, useRef, memo, type MouseEvent, type KeyboardEvent, ComponentType } from 'react';
import cc from 'classcat';
import {
  clampPosition,
  elementSelectionKeys,
  errorMessages,
  getPositionWithOrigin,
  internalsSymbol,
  isInputDOMNode,
  NodeProps,
  type XYPosition,
} from '@xyflow/system';

import { useStore, useStoreApi } from '../../hooks/useStore';
import { Provider } from '../../contexts/NodeIdContext';
import { ARIA_NODE_DESC_KEY } from '../A11yDescriptions';
import useDrag from '../../hooks/useDrag';
import useUpdateNodePositions from '../../hooks/useUpdateNodePositions';
import { handleNodeClick } from './utils';
import type { NodeWrapperProps } from '../../types';

export const arrowKeyDiffs: Record<string, XYPosition> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const NodeWrapper = ({
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
}: NodeWrapperProps) => {
  const node = useStore((s) => s.nodeLookup.get(id)!);

  let nodeType = node.type || 'default';

  if (!nodeTypes[nodeType]) {
    onError?.('003', errorMessages['error003'](nodeType));
    nodeType = 'default';
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

  const updatePositions = useUpdateNodePositions();

  useEffect(() => {
    if (nodeRef.current && !node.hidden) {
      const currNode = nodeRef.current;
      resizeObserver?.observe(currNode);

      return () => resizeObserver?.unobserve(currNode);
    }
  }, [node.hidden]);

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

  const NodeComponent = (nodeTypes[nodeType] || nodeTypes.default) as ComponentType<NodeProps>;
  const width = node.width ?? undefined;
  const height = node.height ?? undefined;
  const computedWidth = node.computed?.width;
  const computedHeight = node.computed?.height;
  const positionAbsolute = nodeExtent
    ? clampPosition(node.computed?.positionAbsolute, nodeExtent)
    : node.computed?.positionAbsolute || { x: 0, y: 0 };
  const positionAbsoluteOrigin = getPositionWithOrigin({
    x: positionAbsolute.x,
    y: positionAbsolute.y,
    width: computedWidth ?? width ?? 0,
    height: computedHeight ?? height ?? 0,
    origin: node.origin || nodeOrigin,
  });
  const initialized = (!!computedWidth && !!computedHeight) || (!!width && !!height);
  const zIndex = node[internalsSymbol]?.z ?? 0;
  const isParent = !!node[internalsSymbol]?.isParent;
  const hasPointerEvents = isSelectable || isDraggable || onClick || onMouseEnter || onMouseMove || onMouseLeave;

  const onMouseEnterHandler =
    onMouseEnter === undefined ? undefined : (event: MouseEvent) => onMouseEnter(event, { ...node });
  const onMouseMoveHandler =
    onMouseMove === undefined ? undefined : (event: MouseEvent) => onMouseMove(event, { ...node });
  const onMouseLeaveHandler =
    onMouseLeave === undefined ? undefined : (event: MouseEvent) => onMouseLeave(event, { ...node });
  const onContextMenuHandler =
    onContextMenu === undefined ? undefined : (event: MouseEvent) => onContextMenu(event, { ...node });
  const onDoubleClickHandler =
    onDoubleClick === undefined ? undefined : (event: MouseEvent) => onDoubleClick(event, { ...node });

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
    if (isInputDOMNode(event.nativeEvent)) {
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
    } else if (
      !disableKeyboardA11y &&
      isDraggable &&
      node.selected &&
      Object.prototype.hasOwnProperty.call(arrowKeyDiffs, event.key)
    ) {
      store.setState({
        ariaLiveMessage: `Moved selected node ${event.key
          .replace('Arrow', '')
          .toLowerCase()}. New position, x: ${~~positionAbsolute.x}, y: ${~~positionAbsolute.y}`,
      });

      updatePositions({
        x: arrowKeyDiffs[event.key].x,
        y: arrowKeyDiffs[event.key].y,
        isShiftPressed: event.shiftKey,
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
          dragging,
        },
      ])}
      ref={nodeRef}
      style={{
        zIndex,
        transform: `translate(${positionAbsoluteOrigin.x}px,${positionAbsoluteOrigin.y}px)`,
        pointerEvents: hasPointerEvents ? 'all' : 'none',
        visibility: initialized ? 'visible' : 'hidden',
        width,
        height,
        ...node.style,
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
          width={computedWidth}
          height={computedHeight}
          positionAbsoluteX={positionAbsolute.x}
          positionAbsoluteY={positionAbsolute.y}
          selected={node.selected}
          isConnectable={isConnectable}
          sourcePosition={node.sourcePosition}
          targetPosition={node.targetPosition}
          dragging={dragging}
          dragHandle={node.dragHandle}
          zIndex={zIndex}
        />
      </Provider>
    </div>
  );
};

NodeWrapper.displayName = 'NodeWrapper';

export default memo(NodeWrapper);
