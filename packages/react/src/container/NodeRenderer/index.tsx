import { memo, useMemo, useEffect, useRef, type ComponentType } from 'react';
import { shallow } from 'zustand/shallow';
import { internalsSymbol, errorMessages, Position, clampPosition, getPositionWithOrigin } from '@xyflow/system';

import useVisibleNodes from '../../hooks/useVisibleNodes';
import { useStore } from '../../hooks/useStore';
import { containerStyle } from '../../styles/utils';
import { GraphViewProps } from '../GraphView';
import type { NodeTypesWrapped, ReactFlowState, WrapNodeProps } from '../../types';

type NodeRendererProps = Pick<
  GraphViewProps,
  | 'onNodeClick'
  | 'onNodeDoubleClick'
  | 'onNodeMouseEnter'
  | 'onNodeMouseMove'
  | 'onNodeMouseLeave'
  | 'onNodeContextMenu'
  | 'onlyRenderVisibleElements'
  | 'noPanClassName'
  | 'noDragClassName'
  | 'rfId'
  | 'disableKeyboardA11y'
  | 'nodeOrigin'
  | 'nodeExtent'
> & {
  nodeTypes: NodeTypesWrapped;
};

const selector = (s: ReactFlowState) => ({
  nodesDraggable: s.nodesDraggable,
  nodesConnectable: s.nodesConnectable,
  nodesFocusable: s.nodesFocusable,
  elementsSelectable: s.elementsSelectable,
  updateNodeDimensions: s.updateNodeDimensions,
  onError: s.onError,
});

const NodeRenderer = (props: NodeRendererProps) => {
  const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, updateNodeDimensions, onError } =
    useStore(selector, shallow);
  const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
  const resizeObserverRef = useRef<ResizeObserver>();

  const resizeObserver = useMemo(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = new Map();

      entries.forEach((entry: ResizeObserverEntry) => {
        const id = entry.target.getAttribute('data-id') as string;
        updates.set(id, {
          id,
          nodeElement: entry.target as HTMLDivElement,
          forceUpdate: true,
        });
      });

      updateNodeDimensions(updates);
    });

    resizeObserverRef.current = observer;

    return observer;
  }, []);

  useEffect(() => {
    return () => {
      resizeObserverRef?.current?.disconnect();
    };
  }, []);

  return (
    <div className="react-flow__nodes" style={containerStyle}>
      {nodes.map((node) => {
        let nodeType = node.type || 'default';

        if (!props.nodeTypes[nodeType]) {
          onError?.('003', errorMessages['error003'](nodeType));

          nodeType = 'default';
        }

        const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;
        const isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
        const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
        const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
        const isFocusable = !!(node.focusable || (nodesFocusable && typeof node.focusable === 'undefined'));

        const clampedPosition = props.nodeExtent
          ? clampPosition(node.computed?.positionAbsolute, props.nodeExtent)
          : node.computed?.positionAbsolute;

        const posX = clampedPosition?.x ?? 0;
        const posY = clampedPosition?.y ?? 0;
        const posOrigin = getPositionWithOrigin({
          x: posX,
          y: posY,
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
            xPos={posX}
            yPos={posY}
            xPosOrigin={posOrigin.x}
            yPosOrigin={posOrigin.y}
            positionAbsolute={clampedPosition || { x: 0, y: 0 }}
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
            resizeObserver={resizeObserver}
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
      })}
    </div>
  );
};

NodeRenderer.displayName = 'NodeRenderer';

export default memo(NodeRenderer);
