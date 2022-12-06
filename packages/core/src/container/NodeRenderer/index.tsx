import { memo, useMemo, useEffect, useRef } from 'react';
import type { ComponentType } from 'react';
import shallow from 'zustand/shallow';

import useVisibleNodes from '../../hooks/useVisibleNodes';
import { useStore } from '../../hooks/useStore';
import { clampPosition, devWarn, internalsSymbol } from '../../utils';
import { containerStyle } from '../../styles';
import { GraphViewProps } from '../GraphView';
import { getPositionWithOrigin } from './utils';
import { Position } from '../../types';
import type { ReactFlowState, WrapNodeProps } from '../../types';

type NodeRendererProps = Pick<
  GraphViewProps,
  | 'nodeTypes'
  | 'selectNodesOnDrag'
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
>;

const selector = (s: ReactFlowState) => ({
  nodesDraggable: s.nodesDraggable,
  nodesConnectable: s.nodesConnectable,
  nodesFocusable: s.nodesFocusable,
  elementsSelectable: s.elementsSelectable,
  updateNodeDimensions: s.updateNodeDimensions,
});

const NodeRenderer = (props: NodeRendererProps) => {
  const { nodesDraggable, nodesConnectable, nodesFocusable, elementsSelectable, updateNodeDimensions } = useStore(
    selector,
    shallow
  );
  const nodes = useVisibleNodes(props.onlyRenderVisibleElements);
  const resizeObserverRef = useRef<ResizeObserver>();

  const resizeObserver = useMemo(() => {
    if (typeof ResizeObserver === 'undefined') {
      return null;
    }

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      const updates = entries.map((entry: ResizeObserverEntry) => ({
        id: entry.target.getAttribute('data-id') as string,
        nodeElement: entry.target as HTMLDivElement,
        forceUpdate: true,
      }));

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
          devWarn(
            `Node type "${nodeType}" not found. Using fallback type "default". Help: https://reactflow.dev/error#300`
          );

          nodeType = 'default';
        }

        const NodeComponent = (props.nodeTypes[nodeType] || props.nodeTypes.default) as ComponentType<WrapNodeProps>;
        const isDraggable = !!(node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'));
        const isSelectable = !!(node.selectable || (elementsSelectable && typeof node.selectable === 'undefined'));
        const isConnectable = !!(node.connectable || (nodesConnectable && typeof node.connectable === 'undefined'));
        const isFocusable = !!(node.focusable || (nodesFocusable && typeof node.focusable === 'undefined'));

        const clampedPosition = props.nodeExtent
          ? clampPosition(node.positionAbsolute, props.nodeExtent)
          : node.positionAbsolute;

        const posX = clampedPosition?.x ?? 0;
        const posY = clampedPosition?.y ?? 0;
        const posOrigin = getPositionWithOrigin({
          x: posX,
          y: posY,
          width: node.width ?? 0,
          height: node.height ?? 0,
          origin: props.nodeOrigin,
        });

        return (
          <NodeComponent
            key={node.id}
            id={node.id}
            className={node.className}
            style={node.style}
            type={nodeType}
            data={node.data}
            sourcePosition={node.sourcePosition || Position.Bottom}
            targetPosition={node.targetPosition || Position.Top}
            hidden={node.hidden}
            xPos={posX}
            yPos={posY}
            xPosOrigin={posOrigin.x}
            yPosOrigin={posOrigin.y}
            selectNodesOnDrag={props.selectNodesOnDrag}
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
            initialized={!!node.width && !!node.height}
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
