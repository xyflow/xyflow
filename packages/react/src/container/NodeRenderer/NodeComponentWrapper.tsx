import { memo, type ComponentType } from 'react';
import { internalsSymbol, errorMessages, Position, clampPosition, getPositionWithOrigin } from '@xyflow/system';

import { useStore } from '../../hooks/useStore';
import type { ReactFlowState, WrapNodeProps } from '../../types';
import { NodeRendererProps } from '.';

function NodeComponentWrapper(props: {
  id: string;
  nodeExtent: NodeRendererProps['nodeExtent'];
  nodeTypes: NodeRendererProps['nodeTypes'];
  nodeOrigin: NodeRendererProps['nodeOrigin'];
  onNodeClick: NodeRendererProps['onNodeClick'];
  onNodeMouseEnter: NodeRendererProps['onNodeMouseEnter'];
  onNodeMouseMove: NodeRendererProps['onNodeMouseMove'];
  onNodeMouseLeave: NodeRendererProps['onNodeMouseLeave'];
  onNodeContextMenu: NodeRendererProps['onNodeContextMenu'];
  onNodeDoubleClick: NodeRendererProps['onNodeDoubleClick'];
  noDragClassName: NodeRendererProps['noDragClassName'];
  noPanClassName: NodeRendererProps['noPanClassName'];
  rfId: NodeRendererProps['rfId'];
  disableKeyboardA11y: NodeRendererProps['disableKeyboardA11y'];
  resizeObserver: ResizeObserver | null;
  nodesDraggable: boolean;
  nodesConnectable: boolean;
  nodesFocusable: boolean;
  elementsSelectable: boolean;
  onError: ReactFlowState['onError'];
}) {
  const node = useStore((s) => s.nodeLookup.get(props.id));
  if (!node) return null;

  let nodeType = node.type || 'default';

  if (!props.nodeTypes[nodeType]) {
    props.onError?.('003', errorMessages['error003'](nodeType));

    nodeType = 'default';
  }

  const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;
  const isDraggable = !!(node.draggable || (props.nodesDraggable && typeof node.draggable === 'undefined'));
  const isSelectable = !!(node.selectable || (props.elementsSelectable && typeof node.selectable === 'undefined'));
  const isConnectable = !!(node.connectable || (props.nodesConnectable && typeof node.connectable === 'undefined'));
  const isFocusable = !!(node.focusable || (props.nodesFocusable && typeof node.focusable === 'undefined'));

  const absolutePositionClamped = props.nodeExtent
    ? clampPosition(node.computed?.positionAbsolute, props.nodeExtent)
    : node.computed?.positionAbsolute || { x: 0, y: 0 };

  const posOrigin = getPositionWithOrigin({
    x: absolutePositionClamped.x,
    y: absolutePositionClamped.y,
    width: node.computed?.width ?? node.width ?? 0,
    height: node.computed?.height ?? node.height ?? 0,
    origin: node.origin || props.nodeOrigin,
  });
  const initialized = (!!node.computed?.width && !!node.computed?.height) || (!!node.width && !!node.height);

  return (
    <NodeComponent
      key={node.id}
      id={node.id}
      className={node.className}
      style={node.style}
      width={node.width ?? undefined}
      height={node.height ?? undefined}
      type={nodeType}
      data={node.data}
      sourcePosition={node.sourcePosition || Position.Bottom}
      targetPosition={node.targetPosition || Position.Top}
      hidden={node.hidden}
      xPosOrigin={posOrigin.x}
      yPosOrigin={posOrigin.y}
      positionAbsoluteX={absolutePositionClamped.x}
      positionAbsoluteY={absolutePositionClamped.y}
      onClick={props.onNodeClick}
      onMouseEnter={props.onNodeMouseEnter}
      onMouseMove={props.onNodeMouseMove}
      onMouseLeave={props.onNodeMouseLeave}
      onContextMenu={props.onNodeContextMenu}
      onDoubleClick={props.onNodeDoubleClick}
      selected={!!node.selected}
      isDraggable={isDraggable}
      isSelectable={isSelectable}
      isConnectable={isConnectable}
      isFocusable={isFocusable}
      resizeObserver={props.resizeObserver}
      dragHandle={node.dragHandle}
      zIndex={node[internalsSymbol]?.z ?? 0}
      isParent={!!node[internalsSymbol]?.isParent}
      noDragClassName={props.noDragClassName}
      noPanClassName={props.noPanClassName}
      initialized={initialized}
      rfId={props.rfId}
      disableKeyboardA11y={props.disableKeyboardA11y}
      ariaLabel={node.ariaLabel}
    />
  );
}

NodeComponentWrapper.displayName = 'NodeComponentWrapper';

export default memo(NodeComponentWrapper);
